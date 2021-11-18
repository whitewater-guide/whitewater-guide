import { SectionInputSchema, TagInputSchema } from '@whitewater-guide/schema';
import * as yup from 'yup';

import { MdEditorSchema } from '../../../formik';
import { SectionFormData } from './types';

export const SectionFormSchema: yup.SchemaOf<SectionFormData> =
  SectionInputSchema.clone()
    .shape({
      tags: yup.mixed().oneOf([undefined]),
      description: MdEditorSchema.clone(),
      kayakingTags: yup.array().of(TagInputSchema),
      hazardsTags: yup.array().of(TagInputSchema),
      supplyTags: yup.array().of(TagInputSchema),
      miscTags: yup.array().of(TagInputSchema),
      timezone: yup
        .object({
          id: yup.string().required() as yup.StringSchema<string>,
          name: yup.string().required() as yup.StringSchema<string>,
        })
        .nullable(),
    })
    .strict(true)
    .noUnknown(true);
