// tslint:disable-next-line
import Joi from 'joi';
import { LANGUAGES } from '../../core';

export const UserInputSchema = Joi.object().keys({
  name: Joi.string().min(3).max(200).optional(),
  avatar: Joi.string().allow('').allow(null).optional(),
  language: Joi.any().valid(LANGUAGES).optional(),
  imperial: Joi.bool().optional(),
});
