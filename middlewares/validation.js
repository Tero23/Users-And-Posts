const Joi = require("joi");

const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const signInSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(10).pattern(new RegExp("[a-zA-Z0-9\\W]")),
});

exports.validateSignIn = validator(signInSchema);
