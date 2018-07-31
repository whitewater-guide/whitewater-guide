import { struct } from '../../utils/validation';
import { TAG_CATEGORIES } from './types';

export const TagInputStruct = struct.object({
  id: 'slug',
  name: 'nonEmptyString',
  category: struct.enum(TAG_CATEGORIES),
});
