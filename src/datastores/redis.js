const redis = require('redis');
const config = require('../config/config');
const logger = require('../config/logger');

const client = redis.createClient(config.redis);

client.on('error', (err) => logger.error('Redis Client Error:', err));

module.exports = client;
