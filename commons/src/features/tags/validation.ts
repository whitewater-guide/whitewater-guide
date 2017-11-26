import * as Joi from 'joi';
import { TAG_CATEGORIES } from './types';

export const TagInputSchema = Joi.object().keys({
  id: Joi.string().regex(/^[a-zA-Z_\-]{3,64}$/),
  name: Joi.string().min(3).max(200),
  category: Joi.any().valid(TAG_CATEGORIES),
});
