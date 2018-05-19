// tslint:disable-next-line
import Joi from 'joi';
import { CoordinateSchema, PointInputSchema } from '../points';
import { TagInputSchema } from '../tags';
import { Durations } from './types';

export const GaugeBindingSchema = Joi.object().keys({
  minimum: Joi.number().allow(null).optional(),
  maximum: Joi.number().allow(null).optional(),
  optimum: Joi.number().allow(null).optional(),
  impossible: Joi.number().allow(null).optional(),
  approximate: Joi.boolean().allow(null).optional(),
});

export const SectionInputSchema = Joi.object().keys({
  id: Joi.string().guid().allow(null),
  name: Joi.string().min(2).max(100),
  altNames: Joi.array().items(Joi.string().min(2)).allow(null),
  description: Joi.string().allow(null).allow(''),
  season: Joi.string().allow(null).allow(''),
  seasonNumeric: Joi.array().max(24).items(Joi.number().min(0).max(23)),

  river: Joi.object().keys({
    id: Joi.string().guid().allow(null),
  }),
  gauge: Joi.object().keys({ id: Joi.string().guid() }).allow(null),
  levels: GaugeBindingSchema.allow(null),
  flows: GaugeBindingSchema.allow(null),
  flowsText: Joi.string().allow(null).allow(''),

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
  hidden: Joi.boolean(),
});

// description is draft.js EditorState
export const SectionFormSchema = SectionInputSchema.keys({
  description: Joi.any(),
  tags: Joi.forbidden(),
  kayakingTags: Joi.array().items(TagInputSchema),
  hazardsTags: Joi.array().items(TagInputSchema),
  supplyTags: Joi.array().items(TagInputSchema),
  miscTags: Joi.array().items(TagInputSchema),
});
