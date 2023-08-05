const { Sequelize } = require('sequelize');
const config = require('../config/config');
const logger = require('../config/logger');

const sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, {
  host: config.mysql.host,
  port: config.mysql.port,
  dialect: 'mysql',
  logging: (msg) => logger.debug(msg),
});

module.exports = sequelize;
