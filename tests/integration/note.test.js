const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Note } = require('../../src/models');
const { userOne, userTwo, insertUsers } = require('../fixtures/user.fixture');
const { noteOne, noteTwo, insertNotes } = require('../fixtures/note.fixture');
const { generateToken } = require('../../src/services/token.service');
const redisClient = require('../../src/datastores/redis');

setupTestDB();

let newNote;
let token;

beforeEach(async () => {
  await insertUsers([userOne]);
  token = generateToken(userOne.id).token;
  newNote = {
    title: faker.lorem.slug(),
    content: faker.lorem.text(),
    type: faker.random.arrayElement(['work', 'personal']),
  };
  await Note.truncate();
});

describe('Note routes', () => {
  describe('POST /v1/notes', () => {
    test('should return 201 and successfully create new note if data is ok', async () => {
      const res = await request(app)
        .post('/v1/notes')
        .set('Authorization', `Bearer ${token}`)
        .send(newNote)
        .expect(httpStatus.CREATED);

      expect(res.body.result).not.toHaveProperty('noteId');
      expect(res.body.result).not.toHaveProperty('UserId');
      expect(res.body.result).not.toHaveProperty('user_id');

      expect(res.body.result).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          title: newNote.title,
          content: newNote.content,
          type: newNote.type,
        })
      );

      const dbNote = await Note.findByPk(res.body.result.id);
      expect(dbNote).toBeDefined();
      expect(dbNote.user_id).toEqual(userOne.id);
      expect(dbNote).toMatchObject({ title: newNote.title, content: newNote.content, type: newNote.type });
    });

    test('should return 201 and successfully create new note if no title provided', async () => {
      delete newNote.title;
      const res = await request(app)
        .post('/v1/notes')
        .set('Authorization', `Bearer ${token}`)
        .send(newNote)
        .expect(httpStatus.CREATED);

      expect(res.body.result.title).toBeDefined();
      expect(res.body.result).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          title: expect.any(String),
          content: newNote.content,
          type: newNote.type,
        })
      );

      const dbNote = await Note.findByPk(res.body.result.id);
      expect(dbNote).toBeDefined();
      expect(dbNote.user_id).toEqual(userOne.id);
      expect(dbNote).toMatchObject({ content: newNote.content, type: newNote.type });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/notes').send(newNote).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if title is already taken', async () => {
      noteOne.user_id = userOne.id;
      await insertNotes([noteOne]);
      newNote.title = noteOne.title;

      await request(app)
        .post('/v1/notes')
        .set('Authorization', `Bearer ${token}`)
        .send(newNote)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if wrong type provided', async () => {
      newNote.type = 'private';

      await request(app)
        .post('/v1/notes')
        .set('Authorization', `Bearer ${token}`)
        .send(newNote)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if no data provided', async () => {
      await request(app).post('/v1/notes').set('Authorization', `Bearer ${token}`).send().expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/notes', () => {
    test('should return 200 with user notes', async () => {
      noteOne.user_id = userOne.id;
      noteTwo.user_id = userOne.id;
      await insertNotes([noteOne, noteTwo]);

      const res = await request(app).get('/v1/notes').set('Authorization', `Bearer ${token}`).send().expect(httpStatus.OK);

      expect(res.body.result).toHaveLength(2);
      expect(res.body.result[0]).toEqual(
        expect.objectContaining({
          id: noteTwo.id,
          title: noteTwo.title,
          content: noteTwo.content,
          type: noteTwo.type,
        })
      );
    });

    test('should return user notes from cache on second time', async () => {
      await redisClient.flushdb();
      noteOne.user_id = userOne.id;
      noteTwo.user_id = userOne.id;
      await insertNotes([noteOne, noteTwo]);

      jest.spyOn(Note, 'findAll');
      jest.spyOn(redisClient, 'HSET');
      const res = await request(app).get('/v1/notes').set('Authorization', `Bearer ${token}`).send().expect(httpStatus.OK);
      expect(Note.findAll).toBeCalled();
      expect(redisClient.HSET).toBeCalled();
      expect(res.body.result).toHaveLength(2);
      expect(res.body.result[0]).toEqual(
        expect.objectContaining({
          id: noteTwo.id,
          title: noteTwo.title,
          content: noteTwo.content,
          type: noteTwo.type,
        })
      );

      jest.clearAllMocks();
      jest.spyOn(Note, 'findAll');
      jest.spyOn(redisClient, 'HGET').mockReturnValue(JSON.stringify(res.body.result));
      const res2 = await request(app).get('/v1/notes').set('Authorization', `Bearer ${token}`).send().expect(httpStatus.OK);
      expect(Note.findAll).not.toBeCalled();
      expect(res2.body.result).toHaveLength(2);
    });

    test('should return 401 if access token is missing', async () => {
      await request(app).get('/v1/notes').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return only logged in user notes', async () => {
      await insertUsers([userTwo]);
      noteOne.user_id = userOne.id;
      noteTwo.user_id = userTwo.id;
      await insertNotes([noteOne, noteTwo]);

      const res = await request(app).get('/v1/notes').set('Authorization', `Bearer ${token}`).send().expect(httpStatus.OK);
      expect(res.body.result).toHaveLength(1);
      expect(res.body.result[0]).toEqual(
        expect.objectContaining({
          id: noteOne.id,
          title: noteOne.title,
          content: noteOne.content,
          type: noteOne.type,
        })
      );
    });

    test('should correctly apply filter on type field', async () => {
      noteOne.user_id = userOne.id;
      noteOne.type = 'work';
      noteTwo.user_id = userOne.id;
      noteTwo.type = 'personal';
      await insertNotes([noteOne, noteTwo]);

      const res = await request(app)
        .get('/v1/notes')
        .set('Authorization', `Bearer ${token}`)
        .query({ type: 'personal' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body.result).toHaveLength(1);
      expect(res.body.result[0].id).toBe(noteTwo.id);
    });

    test('should correctly sort the returned array if sortBy is provided', async () => {
      noteOne.user_id = userOne.id;
      noteOne.type = 'personal';
      noteTwo.user_id = userOne.id;
      noteTwo.type = 'work';
      await insertNotes([noteOne, noteTwo]);

      const res = await request(app)
        .get('/v1/notes')
        .set('Authorization', `Bearer ${token}`)
        .query({ sortBy: 'type' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body.result).toHaveLength(2);
      expect(res.body.result[0].id).toBe(noteTwo.id);
      expect(res.body.result[1].id).toBe(noteOne.id);
    });

    test('should correctly sort the returned array if sortType is provided', async () => {
      noteOne.user_id = userOne.id;
      noteOne.type = 'personal';
      noteTwo.user_id = userOne.id;
      noteTwo.type = 'work';
      await insertNotes([noteOne, noteTwo]);

      const res = await request(app)
        .get('/v1/notes')
        .set('Authorization', `Bearer ${token}`)
        .query({ sortBy: 'type', sortType: 'asc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body.result).toHaveLength(2);
      expect(res.body.result[0].id).toBe(noteOne.id);
      expect(res.body.result[1].id).toBe(noteTwo.id);
    });

    test('should limit returned array if limit param is specified', async () => {
      noteOne.user_id = userOne.id;
      noteTwo.user_id = userOne.id;
      await insertNotes([noteOne, noteTwo]);

      const res = await request(app)
        .get('/v1/notes')
        .set('Authorization', `Bearer ${token}`)
        .query({ limit: 1 })
        .send()
        .expect(httpStatus.OK);

      expect(res.body.result).toHaveLength(1);
      expect(res.body.result[0].id).toBe(noteTwo.id);
    });

    test('should return the correct page if page and limit params are specified', async () => {
      noteOne.user_id = userOne.id;
      noteTwo.user_id = userOne.id;
      await insertNotes([noteOne, noteTwo]);

      const res = await request(app)
        .get('/v1/notes')
        .set('Authorization', `Bearer ${token}`)
        .query({ page: 2, limit: 1 })
        .send()
        .expect(httpStatus.OK);

      expect(res.body.result).toHaveLength(1);
      expect(res.body.result[0].id).toBe(noteOne.id);
    });
  });

  describe('GET /v1/notes/:noteId', () => {
    test('should return 200 and the user object if data is ok', async () => {
      noteOne.user_id = userOne.id;
      await insertNotes([noteOne]);

      const res = await request(app)
        .get(`/v1/notes/${noteOne.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body.result).toEqual(
        expect.objectContaining({
          id: noteOne.id,
          title: noteOne.title,
          content: noteOne.content,
          type: noteOne.type,
        })
      );
    });

    test('should return 401 error if access token is missing', async () => {
      noteOne.user_id = userOne.id;
      await insertNotes([noteOne]);
      await request(app).get(`/v1/notes/${noteOne.id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 error if user is trying to get another user note', async () => {
      await insertUsers([userTwo]);
      noteOne.user_id = userOne.id;
      noteTwo.user_id = userTwo.id;
      await insertNotes([noteOne, noteTwo]);

      await request(app)
        .get(`/v1/notes/${noteTwo.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 404 error if note is not found', async () => {
      await request(app).get(`/v1/notes/52655`).set('Authorization', `Bearer ${token}`).send().expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/notes/:noteId', () => {
    test('should return 204 if deletion is ok', async () => {
      noteOne.user_id = userOne.id;
      await insertNotes([noteOne]);

      await request(app)
        .delete(`/v1/notes/${noteOne.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbNote = await Note.findByPk(noteOne.id);
      expect(dbNote).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).delete(`/v1/notes/${noteOne.id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 error if user is trying to delete another user note', async () => {
      await insertUsers([userTwo]);
      noteOne.user_id = userOne.id;
      noteTwo.user_id = userTwo.id;
      await insertNotes([noteOne, noteTwo]);

      await request(app)
        .delete(`/v1/notes/${noteTwo.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 404 error if note is not founD', async () => {
      await request(app)
        .delete(`/v1/notes/5445454`)
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/notes/:noteId', () => {
    test('should return 200 and successfully update note if data is ok', async () => {
      noteOne.user_id = userOne.id;
      await insertNotes([noteOne]);

      const res = await request(app)
        .patch(`/v1/notes/${noteOne.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(newNote)
        .expect(httpStatus.OK);

      expect(res.body.result).toEqual(
        expect.objectContaining({
          id: noteOne.id,
          title: newNote.title,
          content: newNote.content,
          type: newNote.type,
        })
      );

      const dbNote = await Note.findByPk(noteOne.id);
      expect(dbNote).toBeDefined();
      expect(dbNote).toMatchObject({ id: noteOne.id, title: newNote.title, content: newNote.content, type: newNote.type });
    });

    test('should return 401 error if access token is missing', async () => {
      noteOne.user_id = userOne.id;
      await insertNotes([noteOne]);
      await request(app).patch(`/v1/notes/${noteOne.id}`).send(newNote).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 if user is updating another user note', async () => {
      await insertUsers([userTwo]);
      noteOne.user_id = userOne.id;
      noteTwo.user_id = userTwo.id;
      await insertNotes([noteOne, noteTwo]);

      await request(app)
        .patch(`/v1/notes/${noteTwo.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(newNote)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 404 error if noteId is not found', async () => {
      noteOne.user_id = userOne.id;
      await insertNotes([noteOne]);

      await request(app)
        .patch(`/v1/notes/4564849`)
        .set('Authorization', `Bearer ${token}`)
        .send(newNote)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 if title is already taken', async () => {
      noteOne.user_id = userOne.id;
      noteTwo.user_id = userOne.id;
      await insertNotes([noteOne, noteTwo]);
      const updateBody = { title: noteTwo.title };

      await request(app)
        .patch(`/v1/notes/${noteOne.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should not return 400 if title is current note title', async () => {
      noteOne.user_id = userOne.id;
      noteTwo.user_id = userOne.id;
      await insertNotes([noteOne, noteTwo]);
      const updateBody = { title: noteOne.title };

      await request(app)
        .patch(`/v1/notes/${noteOne.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateBody)
        .expect(httpStatus.OK);
    });

    test('should return 400 if invalid type provided', async () => {
      noteOne.user_id = userOne.id;
      await insertNotes([noteOne]);
      const updateBody = { type: 'private' };

      await request(app)
        .patch(`/v1/notes/${noteOne.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
