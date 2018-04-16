// tslint:disable-next-line
import Joi from 'joi';
import { POINames } from './POITypes';

export const CoordinateSchema = Joi.array().ordered(
  Joi.number().min(-180).max(180).required().label('longitude'), // longitude
  Joi.number().min(-90).max(90).required().label('latitude'), // latitude
  Joi.number().required().label('altitude'), // altitude
);

export const CoordinateSchemaLoose = Joi.array().ordered(
  Joi.number().min(-180).max(180).required().label('longitude'), // longitude
  Joi.number().min(-90).max(90).required().label('latitude'), // latitude
  Joi.number().label('altitude').optional(), // altitude
).sparse(true);

export const PointInputSchema = Joi.object().keys({
  id: Joi.string().guid().allow(null),
  name: Joi.string().allow(null).allow(''),
  description: Joi.string().allow(null).allow(''),
  coordinates: CoordinateSchema.required(),
  kind: Joi.any().allow(POINames),
});
