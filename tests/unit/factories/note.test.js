const PersonalNote = require('../../../src/dtos/personalNote.dto');
const WorkNote = require('../../../src/dtos/workNote.dto');
const NoteDtoFactory = require('../../../src/factories/note.factory');

describe('NoteDtoFactory', () => {
  it('should create PersonalNoteDto instance', () => {
    const personalNote = NoteDtoFactory.createDto('personal');
    expect(personalNote).toBeInstanceOf(PersonalNote);
  });

  it('should create WorkNoteDto instance', () => {
    const workNote = NoteDtoFactory.createDto('work');
    expect(workNote).toBeInstanceOf(WorkNote);
  });

  it('should return an error for unsupported note type', () => {
    const unsupportedNoteType = 'invalid';
    const result = NoteDtoFactory.createDto(unsupportedNoteType);
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('note type not supported');
  });
});
