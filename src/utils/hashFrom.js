const { createHash } = require('crypto');

const hashFrom = (...args) => {
  const string = args.reduce((acc, arg) => {
    if (typeof arg === 'object') {
      return acc + JSON.stringify(arg);
    }
    return acc + arg;
  }, '');
  return createHash('sha256').update(string).digest('hex');
};

module.exports = hashFrom;
