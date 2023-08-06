const { Sequelize } = require('sequelize');
const config = require('../config/config');
const logger = require('../config/logger');

let sequelize;

sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, {
  host: config.mysql.host,
  port: config.mysql.port,
  dialect: 'mysql',
  logging: (msg) => logger.debug(msg),
});

if (config.env === 'test') sequelize = new Sequelize('sqlite:./tests/test.db', { logging: () => {} });

module.exports = sequelize;
