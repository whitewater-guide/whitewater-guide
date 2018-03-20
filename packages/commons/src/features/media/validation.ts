// tslint:disable-next-line
import Joi from 'joi';
import { MediaKind } from './types';

export const MediaInputSchema = Joi.object().keys({
  id: Joi.string().guid().allow(null),
  description: Joi.string().min(3).max(200).allow(null),
  copyright: Joi.string().min(3).max(500).allow(null),
  url: Joi.string(),
  kind: Joi.any().allow(MediaKind.photo, MediaKind.video, MediaKind.blog),
  resolution: Joi.array().items(Joi.number().integer()).min(2).max(2).allow(null),
  weight: Joi.number().integer().allow(null),
});
