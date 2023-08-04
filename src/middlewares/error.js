const httpStatus = require('http-status');
const ApiError = require('../errors/ApiError');

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const response = {
    code: err.statusCode,
    message: err.message,
  };

  return res.status(err.statusCode).json(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
