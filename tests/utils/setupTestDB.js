const sequelize = require('../../src/datastores/mysql');
const models = require('../../src/models');

const setupTestDB = () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await models.Note.truncate();
    await models.User.truncate();
  });

  afterAll(async () => {
    await sequelize.close();
  });
};

module.exports = setupTestDB;
