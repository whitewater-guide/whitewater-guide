import { Type } from 'superstruct';
import { baseStruct } from '../../utils/validation';
import { HarvestModeStruct } from '../harvest-mode';
import { ScriptStruct } from '../scripts';

const SourceInputFields = {
  id: 'uuid|null',
  name: 'nonEmptyString',
  termsOfUse: 'string|null',
  script: 'script',
  requestParams: 'object|null',
  cron: baseStruct.union(['cron', 'null', baseStruct.literal('')]),
  harvestMode: HarvestModeStruct,
  url: baseStruct.union(['url', 'null', baseStruct.literal('')]),
  regions: ['node'],
};

export const SourceInputStruct = baseStruct.object(SourceInputFields);

export const SourceFormStruct = (richTextStruct?: Type) =>
  baseStruct.object({
    ...SourceInputFields,
    termsOfUse: richTextStruct || 'any',
    script: ScriptStruct,
  });
