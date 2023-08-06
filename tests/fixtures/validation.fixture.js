const Joi = require('joi');

const JoiCompile = (schema, object) => {
  return Joi.compile(schema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);
};

module.exports = {
  JoiCompile,
};
