const sequelize = require('../datastores/mysql');
const logger = require('../config/logger');
require('../models');

(async () => {
  await sequelize.sync({ alter: true });
  logger.info('database synced');
})();
