import { struct } from '../../utils/validation';

export const RiverInputStruct = struct.object({
  id: 'uuid|null',
  name: 'nonEmptyString',
  region: 'node',
  altNames: struct.union([struct.list(['nonEmptyString']), 'null']),
});
