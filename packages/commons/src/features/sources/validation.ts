// tslint:disable-next-line
import Joi from 'joi';
import { JoiWithCron } from '../../utils';
import { HarvestMode } from './types';

const HarvestModeSchema = Joi.any().allow([HarvestMode.ONE_BY_ONE, HarvestMode.ALL_AT_ONCE]);

export const SourceInputSchema = Joi.object().keys({
  id: Joi.string().guid().allow(null),
  name: Joi.string().min(3).max(100),
  termsOfUse: Joi.string().allow(null),
  script: Joi.string().min(1),
  cron: JoiWithCron.string().isCron().allow(null),
  harvestMode: HarvestModeSchema,
  url: Joi.string().uri().allow(null),
  regions: Joi.array().items(Joi.object().keys({ id: Joi.string().guid() })),
});

// description is draft.js EditorState
export const SourceFormSchema = SourceInputSchema.keys({
  termsOfUse: Joi.any(),
  script: Joi.object().keys({
    id: Joi.string().min(3).max(100),
    name: Joi.string().min(3).max(100),
    harvestMode: HarvestModeSchema,
  }),
});
