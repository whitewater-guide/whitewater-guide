import * as yup from 'yup';

import { TAG_CATEGORIES, TagInput } from './types';

import { yupTypes } from '@whitewater-guide/validation';

export const TagInputSchema = yup
  .object<TagInput>({
    id: yupTypes.slug(),
    name: yupTypes.nonEmptyString(),
    category: yup.mixed().oneOf(TAG_CATEGORIES),
  })
  .strict(true)
  .noUnknown();
