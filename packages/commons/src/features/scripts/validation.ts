import * as yup from 'yup';

import { Script } from './types';

export const ScriptSchema = yup
  .object<Script>({
    id: yup.string().defined().nullable(false).min(1).max(20),
    name: yup.string().defined().nullable(false).min(1).max(20),
  })
  .strict(true)
  .noUnknown();
