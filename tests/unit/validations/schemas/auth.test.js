const { JoiCompile } = require('../../../fixtures/validation.fixture');
const { register, login } = require('../../../../src/validations/schemas/auth.validation');

describe('Authentication Validation Tests', () => {
  test('Register Validation', () => {
    const validUser = {
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
      },
    };

    const invalidUserShortPassword = {
      body: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'Pass123',
      },
    };

    const invalidUserWeakPassword = {
      body: {
        name: 'Bob Smith',
        email: 'bob@example.com',
        password: 'WeakPassword',
      },
    };

    expect(JoiCompile(register, validUser).error).toBeUndefined();
    expect(JoiCompile(register, invalidUserShortPassword).error).toBeDefined();
    expect(JoiCompile(register, invalidUserWeakPassword).error).toBeDefined();
  });

  test('Login Validation', () => {
    const validCredentials = {
      body: {
        email: 'john@example.com',
        password: 'Password123',
      },
    };

    const invalidCredentialsNoPassword = {
      body: {
        email: 'john@example.com',
      },
    };

    const invalidCredentialsNoEmail = {
      body: {
        password: 'Password123',
      },
    };

    expect(JoiCompile(login, validCredentials).error).toBeUndefined();
    expect(JoiCompile(login, invalidCredentialsNoPassword).error).toBeDefined();
    expect(JoiCompile(login, invalidCredentialsNoEmail).error).toBeDefined();
  });
});
