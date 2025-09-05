import Joi from 'joi';

export const transactionSchema = Joi.object({
  amount: Joi.number().required(),
  description: Joi.string().min(3).required(),
  categoryId: Joi.number().integer().required(),
});
