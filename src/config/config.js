const path = require('path');
const dotenv = require('dotenv');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MYSQL_HOST: Joi.string().default('localhost').description('Mysql DB host'),
    MYSQL_PORT: Joi.number().default(3306).description('Mysql DB port'),
    MYSQL_DATABASE: Joi.string().required().description('Mysql DB name'),
    MYSQL_USERNAME: Joi.string().required().description('Mysql DB username'),
    MYSQL_PASSWORD: Joi.string().required().description('Mysql DB password'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    REDIS_HOST: Joi.string().default('localhost').description('redis server host'),
    REDIS_PORT: Joi.number().default(6379).description('redis server port'),
    REDIS_PASSWORD: Joi.string().allow(null, '').description('redis server password'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mysql: {
    host: envVars.MYSQL_HOST,
    port: envVars.MYSQL_PORT,
    database: envVars.MYSQL_DATABASE,
    username: envVars.MYSQL_USERNAME,
    password: envVars.MYSQL_PASSWORD,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
  },
  redis: {
    socket: {
      host: envVars.REDIS_HOST,
      port: envVars.REDIS_PORT,
    },
    password: envVars.REDIS_PASSWORD,
  },
};
