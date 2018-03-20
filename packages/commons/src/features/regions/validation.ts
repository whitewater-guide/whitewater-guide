// tslint:disable-next-line
import Joi from 'joi';
import { CoordinateSchema, PointInputSchema } from '../points';

export const RegionInputSchema = Joi.object().keys({
  id: Joi.string().guid().allow(null),
  name: Joi.string().min(3).max(100),
  description: Joi.string().allow(null),
  season: Joi.string().allow(null),
  seasonNumeric: Joi.array().max(24).items(Joi.number().min(0).max(23)),
  bounds: Joi.array().items(CoordinateSchema).min(3),
  hidden: Joi.boolean(),
  pois: Joi.array().items(PointInputSchema),
});

// description is draft.js EditorState
export const RegionFormSchema = RegionInputSchema.keys({
  description: Joi.any(),
});
