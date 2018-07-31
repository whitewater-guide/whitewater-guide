import { customStruct } from '../../utils/validation';
import { TAG_CATEGORIES } from './types';

const TAG_REGEX = /^[0-9a-zA-Z_\-]{3,64}$/;

const struct = customStruct({
  tag: (v: any) => TAG_REGEX.test(v) || 'Invalid tag',
});

export const TagInputStruct = struct.object({
  id: 'tag',
  name: 'nonEmptyString',
  category: struct.enum(TAG_CATEGORIES),
});
