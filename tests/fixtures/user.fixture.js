const faker = require('faker');
const User = require('../../src/models/user.model');

const password = 'password1';

const userOne = {
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
};

const userTwo = {
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
};

const insertUsers = async (users) => User.bulkCreate(users);

module.exports = {
  userOne,
  userTwo,
  insertUsers,
};
