import { yupTypes } from '@whitewater-guide/validation';
import * as yup from 'yup';

import { DescentInput, DescentLevelInput } from './types';

export const DescentLevelInputSchema: yup.SchemaOf<DescentLevelInput> = yup
  .object({
    unit: yup.string().max(20).notRequired().nullable(),
    value: yup.number().required(),
  })
  .strict(true)
  .noUnknown();

export const DescentInputSchema: yup.SchemaOf<DescentInput> = yup
  .object({
    id: yupTypes.uuid().notRequired().nullable(),
    sectionId: yupTypes.uuid().required().nullable(false),
    startedAt: yup.date().required() as any,
    duration: yup.number().integer().min(0).notRequired().nullable(),
    level: DescentLevelInputSchema.clone().notRequired().nullable(),
    comment: yup.string().notRequired().nullable(),
    public: yup.bool().notRequired().nullable(),
  })
  .strict(true)
  .noUnknown();
