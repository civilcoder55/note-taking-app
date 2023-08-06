const faker = require('faker');
const { User } = require('../../../src/models');
const setupTestDB = require('../../utils/setupTestDB');

setupTestDB();

describe('User model', () => {
  describe('User validation', () => {
    let newUser;
    beforeEach(() => {
      newUser = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
      };
    });

    test('should hash password before saving', async () => {
      expect((await User.create(newUser)).password).not.toEqual(newUser.password);
    });
  });

  describe('User toJSON()', () => {
    test('should not return user password when toJSON is called', async () => {
      const newUser = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
      };
      expect((await User.create(newUser)).toJSON()).not.toHaveProperty('password');
    });
  });
});
