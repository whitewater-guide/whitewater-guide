import * as yup from 'yup';

import { TagCategory, TagInput } from '../__generated__/types';

export const TagInputSchema: yup.SchemaOf<TagInput> = yup
  .object({
    id: yup.string().slug().defined().nullable(false),
    name: yup.string().nonEmpty().defined().nullable(false),
    category: yup
      .mixed()
      .defined()
      .nullable(false)
      .oneOf(Object.values(TagCategory)),
  })
  .strict(true)
  .noUnknown();
