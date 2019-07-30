import * as yup from 'yup';
import { yupTypes } from '../../validation';
import { TAG_CATEGORIES, TagInput } from './types';

export const TagInputSchema = yup
  .object<TagInput>({
    id: yupTypes.slug(),
    name: yupTypes.nonEmptyString(),
    category: yup.mixed().oneOf(TAG_CATEGORIES),
  })
  .strict(true)
  .noUnknown();
