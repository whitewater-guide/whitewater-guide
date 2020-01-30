import * as yup from 'yup';
import { Script } from './types';

export const ScriptSchema = yup
  .object<Script>({
    id: yup
      .string()
      .min(1)
      .max(20),
    name: yup
      .string()
      .min(1)
      .max(20),
  })
  .strict(true)
  .noUnknown();
