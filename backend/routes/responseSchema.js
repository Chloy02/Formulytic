const Joi = require('joi');

// Define the schema for answers
const responseSchema = Joi.object({
  // Basic fields for demonstration - adjust based on your actual form structure
  name: Joi.string().trim().min(1).max(100),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^\+?[\d\s-]{8,}$/),
  age: Joi.number().integer().min(0).max(150),
  comments: Joi.string().max(1000),
  // Allow additional unknown fields
}).unknown(true);

module.exports = responseSchema;
