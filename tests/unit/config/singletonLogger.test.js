const singletonLogger = require('../../../src/config/singletonLogger');
const logger = require('../../../src/config/logger');

describe('Logger Singleton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a single instance of the logger', () => {
    const instance1 = singletonLogger.getInstance();
    const instance2 = singletonLogger.getInstance();

    expect(instance1).toBe(instance2);
  });

  it('should return a same instance of the logger using commonJs modules', () => {
    const instance1 = logger;
    const instance2 = logger;

    expect(instance1).toBe(instance2);
  });
});
