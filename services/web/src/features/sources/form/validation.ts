import {
  ScriptSchema,
  SourceInputSchema,
  yupTypes,
} from '@whitewater-guide/commons';
import * as yup from 'yup';
import { MdEditorSchema } from '../../../formik';
import { SourceFormData } from './types';

const SourceFormSchema: yup.Schema<SourceFormData> = SourceInputSchema.clone()
  .shape({
    termsOfUse: MdEditorSchema,
    script: ScriptSchema.clone(),
    requestParams: yupTypes.jsonString().nullable(),
    regions: yup.array().of(yupTypes.namedNode()),
  })
  .strict(true)
  .noUnknown();

export default SourceFormSchema;
