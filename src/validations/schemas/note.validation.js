const Joi = require('joi');

const createNote = {
  body: Joi.object().keys({
    title: Joi.string(),
    content: Joi.string().required(),
    type: Joi.string().required().valid('personal', 'work'),
  }),
};

const getNotes = {
  query: Joi.object().keys({
    type: Joi.string().valid('personal', 'work'),
    sortBy: Joi.string().valid('id', 'type').default('id'),
    sortType: Joi.string().valid('desc', 'asc').default('desc'),
    limit: Joi.number().integer().max(100).default(10),
    page: Joi.number().integer().default(1),
  }),
};

const getNote = {
  params: Joi.object().keys({
    noteId: Joi.number().required(),
  }),
};

const updateNote = {
  params: Joi.object().keys({
    noteId: Joi.number().required(),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      content: Joi.string(),
      type: Joi.string().valid('personal', 'work'),
    })
    .min(1),
};

const deleteNote = {
  params: Joi.object().keys({
    noteId: Joi.number().required(),
  }),
};

module.exports = {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
};
