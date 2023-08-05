const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateToken = (userId, expiresIn = config.jwt.accessExpirationMinutes * 60, secret = config.jwt.secret) => {
  return {
    token: jwt.sign({ sub: userId }, secret, { expiresIn }),
    expiresIn,
  };
};

const verifyToken = (token, secret = config.jwt.secret) => {
  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken,
};
