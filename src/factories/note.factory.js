const PersonalNote = require('../dtos/personalNote.dto');
const WorkNote = require('../dtos/workNote.dto');

const map = {
  work: WorkNote,
  personal: PersonalNote,
};

class NoteDtoFactory {
  static createDto(type) {
    if (map[type]) {
      return new map[type]();
    }
    return new Error('note type not supported');
  }
}

module.exports = NoteDtoFactory;
