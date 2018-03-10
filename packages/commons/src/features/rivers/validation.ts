// tslint:disable-next-line
import * as Joi from 'joi';

export const RiverInputSchema = Joi.object().keys({
  id: Joi.string().guid().allow(null),
  name: Joi.string().min(2).max(200),
  region: Joi.object().keys({ id: Joi.string().guid() }),
  altNames: Joi.array().items(Joi.string().min(2)).allow(null),
});
