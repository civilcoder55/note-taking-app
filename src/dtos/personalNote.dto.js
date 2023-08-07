const Note = require('./note.dto');

class PersonalNote extends Note {
  constructor() {
    super();
    this.priority = 'low';
    this.privacy = 'private';
  }
}
module.exports = PersonalNote;
