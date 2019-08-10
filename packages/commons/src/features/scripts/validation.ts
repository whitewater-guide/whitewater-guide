import * as yup from 'yup';
import { HarvestModeSchema } from '../harvest-mode';
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
    harvestMode: HarvestModeSchema.clone(),
    error: yup.mixed().oneOf([undefined, null]),
  })
  .strict(true)
  .noUnknown();
