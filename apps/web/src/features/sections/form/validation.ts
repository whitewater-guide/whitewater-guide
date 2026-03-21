import { SectionInputSchema, TagInputSchema } from '@whitewater-guide/schema';
import type { ObjectSchema } from 'yup';
import { array, mixed, object, string } from 'yup';

import { MdEditorSchema } from '../../../formik';
import type { SectionFormData } from './types';

export const SectionFormSchema: ObjectSchema<SectionFormData> =
  SectionInputSchema.clone()
    .shape({
      tags: mixed().oneOf([undefined]),
      description: MdEditorSchema.clone(),
      kayakingTags: array().of(TagInputSchema).required(),
      hazardsTags: array().of(TagInputSchema).required(),
      supplyTags: array().of(TagInputSchema).required(),
      miscTags: array().of(TagInputSchema).required(),
      timezone: object({
        id: string().required(),
        name: string().required(),
      }).nullable(),
    })
    .strict(true)
    .noUnknown(true);
