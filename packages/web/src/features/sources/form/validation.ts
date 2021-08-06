import { ScriptSchema, SourceInputSchema } from '@whitewater-guide/schema';
import { yupSchemas } from '@whitewater-guide/validation';
import * as yup from 'yup';

import { MdEditorSchema } from '../../../formik';
import { SourceFormData } from './types';

const SourceFormSchema: yup.SchemaOf<SourceFormData> = SourceInputSchema.clone()
  .shape({
    termsOfUse: MdEditorSchema,
    script: ScriptSchema.clone(),
    requestParams: yup.string().jsonString().nullable(),
    regions: yup.array().of(yupSchemas.refInput()),
  })
  .strict(true)
  .noUnknown();

export default SourceFormSchema;
