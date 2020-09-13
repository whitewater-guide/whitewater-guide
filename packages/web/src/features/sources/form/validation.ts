import { ScriptSchema, SourceInputSchema } from '@whitewater-guide/commons';
import { yupTypes } from '@whitewater-guide/validation';
import * as yup from 'yup';

import { MdEditorSchema } from '../../../formik';

const SourceFormSchema = SourceInputSchema.clone()
  .shape({
    termsOfUse: MdEditorSchema,
    script: ScriptSchema.clone(),
    requestParams: yupTypes.jsonString().nullable(),
    regions: yup.array().of(yupTypes.namedNode()),
  })
  .strict(true)
  .noUnknown();

export default SourceFormSchema;
