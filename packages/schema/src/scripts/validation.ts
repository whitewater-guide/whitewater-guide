import * as yup from 'yup';

import { Script } from '../__generated__/types';

export const ScriptSchema: yup.SchemaOf<Script> = yup
  .object({
    __typename: yup.mixed().optional(),
    id: yup.string().defined().nullable(false).min(1).max(20),
    name: yup.string().defined().nullable(false).min(1).max(20),
  })
  .strict(true)
  .noUnknown();
