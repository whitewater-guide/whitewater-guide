import { yupTypes } from '@whitewater-guide/validation';
import * as yup from 'yup';

import { TAG_CATEGORIES,TagCategory, TagInput } from './types';

export const TagInputSchema: yup.SchemaOf<TagInput> = yup
  .object({
    id: yupTypes.slug().defined().nullable(false),
    name: yupTypes.nonEmptyString().defined().nullable(false),
    category: yup
      .mixed()
      .defined()
      .nullable(false)
      .oneOf(TAG_CATEGORIES as TagCategory[]),
  })
  .strict(true)
  .noUnknown();
