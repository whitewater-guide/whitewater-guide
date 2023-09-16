import { CoordinateSchema } from '@whitewater-guide/schema';
import { createSafeValidator } from '@whitewater-guide/validation';
import toArray from 'lodash/toArray';
import { array, object } from 'yup';

export const schema = object({
  shape: array().min(2).max(2).of(CoordinateSchema),
})
  .transform(({ shape }) => ({
    shape: [
      shape[0] ? toArray(shape[0]) : undefined,
      shape[1] ? toArray(shape[1]) : undefined,
    ],
  }))
  .defined()
  .noUnknown();

export const validator = createSafeValidator(schema, {
  strict: false,
  noUnknown: true,
});
