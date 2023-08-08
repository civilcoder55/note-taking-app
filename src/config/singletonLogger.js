const winston = require('winston');
const config = require('./config');

class Logger {
  constructor() {
    this.logger = winston.createLogger({
      level: config.env === 'development' ? 'debug' : 'info',
      format: winston.format.combine(
        config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
        winston.format.splat(),
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => `[${timestamp}] ${level}: ${message}`),
      ),
      transports: [
        new winston.transports.Console({
          stderrLevels: ['error'],
        }),
      ],
    });
  }

  static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance.logger;
  }
}

module.exports = Logger;
