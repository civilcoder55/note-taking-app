const express = require('express');
const validator = require('../../middlewares/validator');
const auth = require('../../middlewares/auth');
const authValidationSchema = require('../../validations/schemas/auth.validation');
const authController = require('../../controllers/auth.controller');

const router = express.Router();

router.post('/register', validator(authValidationSchema.register), authController.register);
router.post('/login', validator(authValidationSchema.login), authController.login);
router.get('/me', auth, authController.loggedInUser);

module.exports = router;
