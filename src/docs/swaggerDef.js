const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Note Taking app API documentation',
    version,
  },
  servers: [
    {
      url: `http://127.0.0.1:${config.port}`,
    },
  ],
};

module.exports = swaggerDef;
