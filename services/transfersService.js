const Joi = require('@hapi/joi');

const transferSchema = Joi.object({
  from: Joi.number().strict().required(),
  to: Joi.number().strict().require(),
  value: Joi.number().min(1).max(2000).strict().required(),
})