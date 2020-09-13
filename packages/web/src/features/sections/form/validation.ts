import { SectionInputSchema, TagInputSchema } from '@whitewater-guide/commons';
import * as yup from 'yup';

import { MdEditorSchema } from '../../../formik';

export const SectionFormSchema = SectionInputSchema.clone()
  .shape({
    tags: yup.mixed().oneOf([undefined]),
    description: MdEditorSchema.clone(),
    kayakingTags: yup.array().of(TagInputSchema),
    hazardsTags: yup.array().of(TagInputSchema),
    supplyTags: yup.array().of(TagInputSchema),
    miscTags: yup.array().of(TagInputSchema),
  })
  .strict(true)
  .noUnknown(true);
