import * as yup from 'yup';

import { DescentInput, DescentLevelInput } from '../__generated__/types';

export const DescentLevelInputSchema: yup.SchemaOf<DescentLevelInput> = yup
  .object({
    unit: yup.string().max(20).optional().nullable(),
    value: yup.number().required(),
  })
  .strict(true)
  .noUnknown();

export const DescentInputSchema: yup.SchemaOf<DescentInput> = yup
  .object({
    id: yup.string().uuid().optional().nullable(),
    sectionId: yup.string().uuid().required().nullable(false),
    // Something is wrong with date type
    // https://github.com/jquense/yup/issues/1243
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    startedAt: yup.date().required() as any,
    duration: yup.number().integer().min(0).notRequired().nullable(),
    level: DescentLevelInputSchema.clone().notRequired().nullable(),
    comment: yup.string().notRequired().nullable(),
    public: yup.bool().notRequired().nullable(),
  })
  .strict(true)
  .noUnknown();
