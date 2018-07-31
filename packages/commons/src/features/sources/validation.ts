import { Type } from 'superstruct';
import { struct } from '../../utils/validation';
import { HarvestModeStruct } from '../harvest-mode';
import { ScriptStruct } from '../scripts';

const SourceInputFields = {
  id: 'uuid|null',
  name: 'nonEmptyString',
  termsOfUse: 'string|null',
  script: 'script',
  cron: struct.union(['cron', 'null', struct.literal('')]),
  harvestMode: HarvestModeStruct,
  url: struct.union(['url', 'null', struct.literal('')]),
  regions: ['node'],
};

export const SourceInputStruct = struct.object(SourceInputFields);

export const SourceFormStruct = (richTextStruct?: Type) => struct.object({
  ...SourceInputFields,
  termsOfUse: richTextStruct || 'any',
  script: ScriptStruct,
});
