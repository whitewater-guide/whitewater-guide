import { baseStruct } from '../../utils/validation';
import { HarvestModeStruct } from '../harvest-mode';

export const ScriptStruct = baseStruct.object({
  id: 'script',
  name: 'script',
  harvestMode: HarvestModeStruct,
  error: 'null?',
});
