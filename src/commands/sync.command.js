const mysql = require('mysql2/promise');
const sequelize = require('../datastores/mysql');
const logger = require('../config/logger');
const config = require('../config/config');
require('../models');

(async () => {
  const { host, port, username, password, database } = config.mysql;
  const connection = await mysql.createConnection({ host, port, user: username, password });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
  await connection.end();

  await sequelize.sync({ alter: true });
  logger.info('database synced');
  process.exit();
})();
