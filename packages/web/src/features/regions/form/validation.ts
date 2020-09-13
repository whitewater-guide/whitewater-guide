import { RegionInputSchema } from '@whitewater-guide/commons';

import { MdEditorSchema } from '../../../formik';

export const RegionFormSchema = RegionInputSchema.clone().shape({
  description: MdEditorSchema,
});
