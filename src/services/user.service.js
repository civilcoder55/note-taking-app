const httpStatus = require('http-status');
const User = require('../models/user.model');
const ApiError = require('../errors/ApiError');

const getUserById = async (id) => {
  return User.findByPk(id);
};

const getUserByEmail = async (email) => {
  return User.findOne({ where: { email } });
};

const createUser = async (data) => {
  const userData = data;
  const existedUser = await getUserByEmail(data.email);
  if (existedUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userData);
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
};
