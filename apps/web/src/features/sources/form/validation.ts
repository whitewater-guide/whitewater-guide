import { ScriptSchema, SourceInputSchema } from '@whitewater-guide/schema';
import { yupSchemas } from '@whitewater-guide/validation';
import type { ObjectSchema } from 'yup';
import { array, string } from 'yup';

import { MdEditorSchema } from '../../../formik';
import type { SourceFormData } from './types';

const SourceFormSchema: ObjectSchema<SourceFormData> = SourceInputSchema.clone()
  .shape({
    termsOfUse: MdEditorSchema,
    script: ScriptSchema.clone(),
    requestParams: string().jsonString().nullable(),
    regions: array().of(yupSchemas.refInput()).required(),
  })
  .strict(true)
  .noUnknown();

export default SourceFormSchema;
