import { RegionInputSchema } from '@whitewater-guide/commons';
import * as yup from 'yup';
import { MdEditorSchema } from '../../../formik';
import { RegionFormData } from './types';

export const RegionFormSchema: yup.Schema<
  RegionFormData
> = RegionInputSchema.clone().shape({
  description: MdEditorSchema,
});
