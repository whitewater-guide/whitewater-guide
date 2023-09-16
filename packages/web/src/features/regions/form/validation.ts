import { RegionInputSchema } from '@whitewater-guide/schema';
import type { ObjectSchema } from 'yup';

import { MdEditorSchema } from '../../../formik';
import type { RegionFormData } from './types';

export const RegionFormSchema: ObjectSchema<RegionFormData> =
  RegionInputSchema.clone().shape({
    description: MdEditorSchema,
  });
