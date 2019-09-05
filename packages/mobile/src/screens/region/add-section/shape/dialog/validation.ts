import {
  CoordinateSchema,
  createSafeValidator,
} from '@whitewater-guide/commons';
import * as yup from 'yup';

export const schema = yup
  .object({
    shape: yup
      .array()
      .min(2)
      .max(2)
      .of(CoordinateSchema),
  })
  .noUnknown();

export const validator = createSafeValidator(schema, {
  strict: false,
  noUnknown: true,
});
