import * as yup from 'yup';

import { TAG_CATEGORIES, TagInput, TagCategory } from './types';

import { yupTypes } from '@whitewater-guide/validation';

export const TagInputSchema = yup
  .object<TagInput>({
    id: yupTypes
      .slug()
      .defined()
      .nullable(false),
    name: yupTypes
      .nonEmptyString()
      .defined()
      .nullable(false),
    category: yup
      .mixed()
      .defined()
      .nullable(false)
      .oneOf(TAG_CATEGORIES as TagCategory[]),
  })
  .strict(true)
  .noUnknown();
