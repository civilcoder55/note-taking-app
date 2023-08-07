const Note = require('../../../src/dtos/note.dto');
const PersonalNote = require('../../../src/dtos/personalNote.dto');
const WorkNote = require('../../../src/dtos/workNote.dto');

describe('Note', () => {
  it('should create a Note object from an data', () => {
    const userId = 'user123';
    const data = {
      title: 'Test Title',
      content: 'Test Content',
      type: 'personal',
    };

    const note = new Note().fromObj(userId, data);

    expect(note.user_id).toBe(userId);
    expect(note.title).toBe(data.title);
    expect(note.content).toBe(data.content);
    expect(note.type).toBe(data.type);
  });

  it('should create a Work Note object from an data', () => {
    const userId = 'user123';
    const data = {
      title: 'Test Title',
      content: 'Test Content',
      type: 'personal',
    };

    const note = new WorkNote().fromObj(userId, data);

    expect(note.user_id).toBe(userId);
    expect(note.title).toBe(data.title);
    expect(note.content).toBe(data.content);
    expect(note.type).toBe(data.type);
    expect(note.priority).toBe('high');
    expect(note.privacy).toBe('public');
  });

  it('should create a Personal Note object from an data', () => {
    const userId = 'user123';
    const data = {
      title: 'Test Title',
      content: 'Test Content',
      type: 'personal',
    };

    const note = new PersonalNote().fromObj(userId, data);

    expect(note.user_id).toBe(userId);
    expect(note.title).toBe(data.title);
    expect(note.content).toBe(data.content);
    expect(note.type).toBe(data.type);
    expect(note.priority).toBe('low');
    expect(note.privacy).toBe('private');
  });
});
