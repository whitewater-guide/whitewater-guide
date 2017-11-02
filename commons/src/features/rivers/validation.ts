import * as Joi from 'joi';

export const RiverInputSchema = Joi.object().keys({
  id: Joi.string().guid(),
  name: Joi.string().min(3).max(200),
  region: Joi.object().keys({ id: Joi.string().guid() }),
});
