const httpStatus = require('http-status');
const pick = require('../utils/pick');
const wrapper = require('../utils/wrapper');
const { noteService } = require('../services');
const ApiError = require('../errors/ApiError');
const hashFrom = require('../utils/hashFrom');
const cacheHelper = require('../helpers/cache.helper');

const createNote = wrapper(async (req, res) => {
  const note = await noteService.createUserNote(res.locals.user.id, req.body);
  res.status(httpStatus.CREATED).json({ result: note });
});

const getNotes = wrapper(async (req, res) => {
  const filter = pick(req.query, ['type']);
  const options = pick(req.query, ['sortBy', 'sortType', 'limit', 'page']);

  const result = await cacheHelper.hashGetOrSet(`notes::${res.locals.user.id}`, hashFrom(filter, options), () =>
    noteService.queryUserNotes(res.locals.user.id, filter, options),
  );

  res.json({ result });
});

const getNote = wrapper(async (req, res) => {
  const note = await noteService.getUserNoteById(res.locals.user.id, req.params.noteId);
  if (!note) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Note not found');
  }
  res.json({ result: note });
});

const updateNote = wrapper(async (req, res) => {
  const note = await noteService.updateUserNoteById(res.locals.user.id, req.params.noteId, req.body);
  res.json({ result: note });
});

const deleteNote = wrapper(async (req, res) => {
  await noteService.deleteUserNoteById(res.locals.user.id, req.params.noteId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
};
