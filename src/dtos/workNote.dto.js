const Note = require('./note.dto');

class WorkNote extends Note {
  constructor() {
    super();
    this.priority = 'high';
    this.privacy = 'public';
  }
}
module.exports = WorkNote;
