const sequelize = require('../databases/mysql');
const logger = require('../config/logger');
require('../models');

(async () => {
  await sequelize.sync({ alter: true });
  logger.info('database synced');
})();
