import * as yup from 'yup';
import { HarvestMode } from './types';

export const HarvestModeSchema = yup
  .mixed<HarvestMode>()
  .oneOf(Object.values(HarvestMode));
