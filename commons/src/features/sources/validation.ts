import * as Joi from 'joi';
import { JoiWithCron } from '../../utils';
import { HarvestMode } from './types';

export const SourceInputSchema = Joi.object().keys({
  id: Joi.string().guid().allow(null),
  name: Joi.string().min(3).max(100),
  termsOfUse: Joi.string().allow(null),
  script: Joi.string().min(1),
  cron: JoiWithCron.string().isCron().allow(null),
  enabled: Joi.boolean().allow(null),
  harvestMode: Joi.any().allow([HarvestMode.ONE_BY_ONE, HarvestMode.ALL_AT_ONCE]),
  url: Joi.string().uri().allow(null),
});

// description is draft.js EditorState
export const SourceFormSchema = SourceInputSchema.keys({
  termsOfUse: Joi.any(),
});
