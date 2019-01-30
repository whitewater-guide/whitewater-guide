import { baseStruct } from '../../utils/validation';

export const RiverInputStruct = baseStruct.object({
  id: 'uuid|null',
  name: 'nonEmptyString',
  region: 'node',
  altNames: baseStruct.union([baseStruct.list(['nonEmptyString']), 'null']),
});
