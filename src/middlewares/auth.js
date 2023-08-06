const httpStatus = require('http-status');
const ApiError = require('../errors/ApiError');
const { verifyToken } = require('../services/token.service');
const { getUserById } = require('../services/user.service');

const auth = async (req, res, next) => {
  try {
    const accessToken = req.header('Authorization')?.replace('Bearer ', '');

    if (accessToken) {
      const accessTokenPayload = verifyToken(accessToken);
      const user = await getUserById(accessTokenPayload.sub);
      if (user) {
        res.locals.user = user;
        res.locals.accessToken = accessToken;
        return next();
      }
    }
  } catch (error) {}
  return next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
};

module.exports = auth;
