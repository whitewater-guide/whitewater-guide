// tslint:disable-next-line
import Joi from 'joi';

export const GroupInputSchema = Joi.object().keys({
  id: Joi.string().guid().allow(null),
  name: Joi.string().min(3).max(200),
});
