// tslint:disable-next-line
import * as Joi from 'joi';
import { CoordinateSchema, PointInputSchema } from '../points';
import { Durations } from './types';

export const GaugeBindingSchema = Joi.object().keys({
  minimum: Joi.number().allow(null),
  maximum: Joi.number().allow(null),
  optimum: Joi.number().allow(null),
  impossible: Joi.number().allow(null),
  approximate: Joi.boolean().allow(null),
});

export const SectionInputSchema = Joi.object().keys({
  id: Joi.string().guid().allow(null),
  name: Joi.string().min(2).max(100),
  altNames: Joi.array().items(Joi.string().min(2)).allow(null),
  description: Joi.string().allow(null),
  season: Joi.string().allow(null),
  seasonNumeric: Joi.array().max(24).items(Joi.number().min(0).max(23)),

  river: Joi.object().keys({
    id: Joi.string().guid().allow(null),
  }),
  gauge: Joi.object().keys({ id: Joi.string().guid() }).allow(null),
  levels: GaugeBindingSchema.allow(null),
  flows: GaugeBindingSchema.allow(null),
  flowsText: Joi.string().allow(null),

  shape: Joi.array().items(CoordinateSchema).min(2),
  distance: Joi.number().positive().allow(null),
  drop: Joi.number().positive().allow(null),
  duration: Joi.any().valid(Array.from(Durations.keys())).allow(null),
  difficulty: Joi.number().min(0).max(5),
  difficultyXtra: Joi.string().max(32).allow(null),
  rating: Joi.number().min(0).max(5).allow(null),
  tags: Joi.array().items(Joi.object().keys({
    id: Joi.string(),
  })),
  pois: Joi.array().items(PointInputSchema),
});

// description is draft.js EditorState
export const SectionFormSchema = SectionInputSchema.keys({
  description: Joi.any(),
});
