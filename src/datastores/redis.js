const redis = require('redis');
const config = require('../config/config');
const logger = require('../config/logger');
const redisMock = require('redis-mock');

let client;
client = redis.createClient(config.redis);

if (config.env === 'test') client = redisMock.createClient();

client.on('error', (err) => logger.error('Redis Client Error:', err));

module.exports = client;
