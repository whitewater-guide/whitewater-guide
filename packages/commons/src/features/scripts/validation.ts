import { struct } from '../../utils/validation';
import { HarvestModeStruct } from '../harvest-mode';

export const ScriptStruct = struct.object({
  id: 'script',
  name: 'script',
  harvestMode: HarvestModeStruct,
  error: 'null',
});
