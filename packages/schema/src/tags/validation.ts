import type { ObjectSchema } from 'yup';
import { mixed, object, string } from 'yup';

import type { TagInput } from '../__generated__/types';
import { TagCategory } from '../__generated__/types';

export const TagInputSchema: ObjectSchema<TagInput> = object({
  id: string().slug().defined().nonNullable(),
  name: string().nonEmpty().defined().nonNullable(),
  category: mixed<TagCategory>()
    .defined()
    .nonNullable()
    .oneOf(Object.values(TagCategory)),
})
  .strict(true)
  .noUnknown();
