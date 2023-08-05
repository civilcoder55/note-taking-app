const express = require('express');
const validator = require('../../middlewares/validator');
const auth = require('../../middlewares/auth');
const noteValidationSchema = require('../../validations/schemas/note.validation');
const noteController = require('../../controllers/note.controller');

const router = express.Router();

router
  .route('/')
  .post(auth, validator(noteValidationSchema.createNote), noteController.createNote)
  .get(auth, validator(noteValidationSchema.getNotes), noteController.getNotes);

router
  .route('/:noteId')
  .get(auth, validator(noteValidationSchema.getNote), noteController.getNote)
  .patch(auth, validator(noteValidationSchema.updateNote), noteController.updateNote)
  .delete(auth, validator(noteValidationSchema.deleteNote), noteController.deleteNote);

module.exports = router;
