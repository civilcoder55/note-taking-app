const {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
} = require('../../../../src/validations/schemas/note.validation');
const { JoiCompile } = require('../../../fixtures/validation.fixture');

describe('Validation Tests', () => {
  test('Create Note Validation', () => {
    const validNote = {
      body: {
        title: 'Test Title',
        content: 'Test Content',
        type: 'personal',
      },
    };

    const invalidNote = {
      body: {
        content: 'Test Content',
        type: 'invalidType',
      },
    };
    expect(JoiCompile(createNote, validNote).error).toBeUndefined();
    expect(JoiCompile(createNote, invalidNote).error).toBeDefined();
  });

  test('Get Notes Validation', () => {
    const validNotesQuery = {
      query: {
        type: 'work',
        sortBy: 'id',
        sortType: 'asc',
        limit: 50,
        page: 2,
      },
    };

    const invalidNotesQuery = {
      query: {
        type: 'invalidType',
        sortBy: 'invalidSortBy',
        sortType: 'invalidSortType',
        limit: 'invalidLimit',
        page: 'invalidPage',
      },
    };

    expect(JoiCompile(getNotes, validNotesQuery).error).toBeUndefined();
    expect(JoiCompile(getNotes, invalidNotesQuery).error).toBeDefined();
  });

  test('Get Note Validation', () => {
    const validNoteQuery = {
      params: {
        noteId: 1,
      },
    };

    const invalidNoteQuery = {
      params: {
        noteId: 'invalidId',
      },
    };

    expect(JoiCompile(getNote, validNoteQuery).error).toBeUndefined();
    expect(JoiCompile(getNote, invalidNoteQuery).error).toBeDefined();
  });

  test('Update Note Validation', () => {
    const validNote = {
      params: {
        noteId: 1,
      },
      body: {
        title: 'Updated Title',
        content: 'Updated Content',
        type: 'work',
      },
    };

    const invalidNote = {
      params: {
        noteId: 'invalidId',
      },
      body: {
        title: 'Updated Title',
        content: 'Updated Content',
        type: 'invalidType',
      },
    };

    expect(JoiCompile(updateNote, validNote).error).toBeUndefined();
    expect(JoiCompile(updateNote, invalidNote).error).toBeDefined();
  });

  test('Delete Note Validation', () => {
    const validNoteQuery = {
      params: {
        noteId: 1,
      },
    };

    const invalidNoteQuery = {
      params: {
        noteId: 'invalidId',
      },
    };

    expect(JoiCompile(deleteNote, validNoteQuery).error).toBeUndefined();
    expect(JoiCompile(deleteNote, invalidNoteQuery).error).toBeDefined();
  });
});
