const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const mysql = require('./datastores/mysql');
const redis = require('./datastores/redis');

// start datastores connection
mysql
  .authenticate()
  .then(() => logger.info('MySQL Connection has been established successfully.'))
  .catch((e) => logger.error('Unable to connect to the MySQL:', e));

redis.connect().then(() => {
  logger.info('Redis Client Connected successfully');
});

// start node app server
const server = app.listen(config.port, () => {
  logger.info(`Listening to port ${config.port}`);
});

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.error('SIGTERM received');
  if (server) server.close();
});
