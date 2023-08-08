const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { User } = require('../../src/models');
const { userOne, insertUsers } = require('../fixtures/user.fixture');
const { generateToken } = require('../../src/services/token.service');

setupTestDB();

describe('Auth routes', () => {
  describe('POST /v1/auth/register', () => {
    let newUser;
    beforeEach(() => {
      newUser = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
      };
    });

    test('should return 201 and successfully register user if request data is ok', async () => {
      const res = await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.CREATED);

      expect(res.body.result).not.toHaveProperty('password');
      expect(res.body.result).toHaveProperty('createdAt');
      expect(res.body.result).toHaveProperty('updatedAt');
      expect(res.body.result).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: newUser.name,
          email: newUser.email,
        }),
      );
      const dbUser = await User.findByPk(res.body.result.id);
      expect(dbUser).toBeDefined();
      expect(dbUser.password).not.toBe(newUser.password);
      expect(dbUser).toMatchObject({ name: newUser.name, email: newUser.email });
    });

    test('should return 400 error if email is invalid', async () => {
      newUser.email = 'invalidEmail';

      await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if email is already used', async () => {
      await insertUsers([userOne]);
      newUser.email = userOne.email;

      await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if password length is less than 8 characters', async () => {
      newUser.password = 'passwo1';

      await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if password does not contain both letters and numbers', async () => {
      newUser.password = 'password';

      await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);

      newUser.password = '11111111';

      await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('POST /v1/auth/login', () => {
    test('should return 200 and login user if email and password match', async () => {
      await insertUsers([userOne]);
      const loginCredentials = {
        email: userOne.email,
        password: userOne.password,
      };

      const res = await request(app).post('/v1/auth/login').send(loginCredentials).expect(httpStatus.OK);

      expect(res.body.result).toEqual({
        token: expect.anything(),
        expiresIn: expect.any(Number),
      });
    });

    test('should return 401 error if there are no users with that email', async () => {
      const loginCredentials = {
        email: userOne.email,
        password: userOne.password,
      };

      const res = await request(app).post('/v1/auth/login').send(loginCredentials).expect(httpStatus.UNAUTHORIZED);

      expect(res.body).toEqual({ code: httpStatus.UNAUTHORIZED, message: 'Incorrect email or password' });
    });

    test('should return 401 error if password is wrong', async () => {
      await insertUsers([userOne]);
      const loginCredentials = {
        email: userOne.email,
        password: 'wrongPassword1',
      };

      const res = await request(app).post('/v1/auth/login').send(loginCredentials).expect(httpStatus.UNAUTHORIZED);

      expect(res.body).toEqual({ code: httpStatus.UNAUTHORIZED, message: 'Incorrect email or password' });
    });
  });

  describe('POST /v1/auth/me', () => {
    test('should return 200 with logged in user details if valid token', async () => {
      await insertUsers([userOne]);

      const res = await request(app)
        .get('/v1/auth/me')
        .set('Authorization', `Bearer ${generateToken(userOne.id).token}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body.result).not.toHaveProperty('password');
      expect(res.body.result).toMatchObject({
        id: userOne.id,
        name: userOne.name,
        email: userOne.email,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).get('/v1/auth/me').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 error if access token is wrong', async () => {
      await request(app)
        .get('/v1/auth/me')
        .set('Authorization', `Bearer 45674658875`)
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });
  });
});
