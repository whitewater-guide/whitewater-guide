import { baseStruct } from '../../utils/validation';
import { TAG_CATEGORIES } from './types';

export const TagInputStruct = baseStruct.object({
  id: 'slug',
  name: 'nonEmptyString',
  category: baseStruct.enum(TAG_CATEGORIES),
});
