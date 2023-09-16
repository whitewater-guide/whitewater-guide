import type { ObjectSchema } from 'yup';
import { bool, date, number, object, string } from 'yup';

import type { DescentInput, DescentLevelInput } from '../__generated__/types';

export const DescentLevelInputSchema: ObjectSchema<DescentLevelInput> = object({
  unit: string().max(20).optional().nullable(),
  value: number().required(),
})
  .strict(true)
  .noUnknown();

export const DescentInputSchema: ObjectSchema<DescentInput> = object({
  id: string().uuid().optional().nullable(),
  sectionId: string().uuid().required().nonNullable(),
  startedAt: date().required(),
  duration: number().integer().min(0).notRequired().nullable(),
  level: DescentLevelInputSchema.clone().notRequired().nullable(),
  comment: string().notRequired().nullable(),
  public: bool().notRequired().nullable(),
})
  .strict(true)
  .noUnknown();
