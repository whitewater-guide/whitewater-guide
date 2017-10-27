import * as Joi from 'joi';
import { JoiWithCron, JoiWithJSONString } from '../../utils';
import { PointInputSchema } from '../points';

export const GaugeInputSchema = Joi.object().keys({
  id: Joi.string().guid().allow(null),
  name: Joi.string().min(3).max(100),
  code: Joi.string().min(3).max(100),
  levelUnit: Joi.string().min(1).allow(null),
  flowUnit: Joi.string().min(1).allow(null),
  location: PointInputSchema.allow(null),
  requestParams: JoiWithJSONString.string().isJSONString().allow(null),
  cron: JoiWithCron.string().isCron().allow(null),
  url: Joi.string().uri().allow(null),
  enabled: Joi.boolean(),
  source: Joi.object().keys({ id: Joi.string().guid() }),
});
