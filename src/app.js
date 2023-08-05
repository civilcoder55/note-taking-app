const express = require('express');
const compression = require('compression');
const httpStatus = require('http-status');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./errors/ApiError');
const sequelize = require('./databases/mysql');
require('./models');

// start mysql database connection and init models
sequelize
  .authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch((e) => console.error('Unable to connect to the database:', e));

const app = express();

// parse json request body
app.use(express.json());

// gzip compression
app.use(compression());

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;