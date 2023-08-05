const httpStatus = require('http-status');
const Note = require('../models/note.model');
const ApiError = require('../errors/ApiError');

const getNoteByTitleAndUserId = async (userId, title) => {
  return Note.findOne({ where: { user_id: userId, title } });
};

const validateUniqeTitle = async (userId, title, noteId = null) => {
  if (!title) return;

  const existingNote = await getNoteByTitleAndUserId(userId, title);
  if (existingNote && existingNote.id !== noteId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Title already taken');
  }
};

const createUserNote = async (userId, data) => {
  const noteData = data;
  noteData.user_id = userId;
  await validateUniqeTitle(userId, data.title);
  return Note.create(noteData);
};

const queryUserNotes = async (userId, filter, options) => {
  const notes = await Note.findAll({
    where: {
      user_id: userId,
      ...filter,
    },
    order: [[options.sortBy, options.sortType]],
    limit: options.limit,
    offset: (options.page - 1) * options.limit,
  });
  return notes;
};

const getUserNoteById = async (userId, noteId) => {
  return Note.findOne({ where: { id: noteId, user_id: userId } });
};

const updateUserNoteById = async (userId, noteId, data) => {
  const note = await getUserNoteById(userId, noteId);
  if (!note) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Note not found');
  }
  await validateUniqeTitle(userId, data.title, note.id);
  return note.update(data);
};

const deleteUserNoteById = async (userId, noteId) => {
  const note = await getUserNoteById(userId, noteId);
  if (!note) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Note not found');
  }
  return note.destroy();
};

module.exports = {
  createUserNote,
  queryUserNotes,
  getUserNoteById,
  updateUserNoteById,
  deleteUserNoteById,
};
