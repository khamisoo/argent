require('dotenv').config({ quiet: true });
const Joi = require('joi');

const envSchema = Joi.object({
  PORT: Joi.number().default(3000),
  MONGO_URI: Joi.string().uri().required(),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  CLIENT_URL: Joi.string().uri().default('http://localhost:3000'),
}).unknown();

const { value: env, error } = envSchema.validate(process.env);

if (error) {
  throw new Error(`❌ Config validation error: ${error.message}`);
}

module.exports = env;