import * as Joi from 'joi';
import { CoordinateSchema, PointInputSchema } from '../points';

export const RegionInputSchema = Joi.object().keys({
  id: Joi.string().guid().allow(null),
  name: Joi.string().min(3).max(100),
  description: Joi.string().allow(null),
  season: Joi.string().allow(null),
  seasonNumeric: Joi.array().max(24).items(Joi.number().min(0).max(23)),
  bounds: Joi.array().items(CoordinateSchema),
  hidden: Joi.boolean(),
  pois: Joi.array().items(PointInputSchema),
});
