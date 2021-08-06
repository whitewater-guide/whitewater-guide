import { RegionInputSchema } from '@whitewater-guide/schema';
import * as yup from 'yup';

import { MdEditorSchema } from '../../../formik';
import { RegionFormData } from './types';

export const RegionFormSchema: yup.SchemaOf<RegionFormData> =
  RegionInputSchema.clone().shape({
    description: MdEditorSchema,
  });
