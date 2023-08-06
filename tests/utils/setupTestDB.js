const sequelize = require('../../src/datastores/mysql');
require('../../src/models');

const setupTestDB = () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {});

  afterAll(async () => {
    await sequelize.close();
  });
};

module.exports = setupTestDB;
