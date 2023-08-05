const logger = require('../config/logger');
const redisClient = require('../datastores/redis');

const hashGetOrSet = async (key, field, callback) => {
  let result;
  const cachedResult = await redisClient.HGET(key, field);
  if (cachedResult) {
    result = JSON.parse(cachedResult);
    logger.debug('served from the cache');
  } else {
    result = await callback();
    redisClient.HSET(key, field, JSON.stringify(result));
  }
  return result;
};

const deleteKey = (key) => {
  redisClient.del(key);
};

module.exports = { hashGetOrSet, deleteKey };
