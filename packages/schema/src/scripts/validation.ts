import type { ObjectSchema } from 'yup';
import { object, string } from 'yup';

import type { Script } from '../__generated__/types';

export const ScriptSchema: ObjectSchema<Script> = object({
  __typename: string<'Script'>().nonNullable().optional(),
  id: string().defined().nonNullable().min(1).max(20),
  name: string().defined().nonNullable().min(1).max(20),
})
  .strict(true)
  .noUnknown();
