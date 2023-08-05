const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const userService = require('./user.service');
const ApiError = require('../errors/ApiError');

const validatePassword = function (plain, hash) {
  return bcrypt.compareSync(plain, hash);
};

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !validatePassword(password, user.password)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

module.exports = {
  loginUserWithEmailAndPassword,
  validatePassword,
};
