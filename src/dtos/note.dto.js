class Note {
  fromObj(userId, data) {
    this.user_id = userId;
    this.title = data.title;
    this.content = data.content;
    this.type = data.type;
    return this;
  }
}
module.exports = Note;
