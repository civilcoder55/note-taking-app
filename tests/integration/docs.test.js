const request = require('supertest');
const httpStatus = require('http-status');
const config = require('../../src/config/config');

describe('Auth routes', () => {
  describe('GET /v1/docs', () => {
    test('should return 404 when running in production', async () => {
      config.env = 'production';
      // eslint-disable-next-line global-require
      await request(require('../../src/app')).get('/v1/docs').send().expect(httpStatus.NOT_FOUND);
      config.env = process.env.NODE_ENV;
    });
  });
});
