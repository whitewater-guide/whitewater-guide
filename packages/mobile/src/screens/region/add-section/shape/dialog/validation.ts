import {
  CoordinateSchema,
  createSafeValidator,
} from '@whitewater-guide/commons';
import toArray from 'lodash/toArray';
import * as yup from 'yup';

export const schema = yup
  .object({
    shape: yup
      .array()
      .min(2)
      .max(2)
      .of(CoordinateSchema),
  })
  .transform(({ shape }) => {
    return {
      shape: [
        shape[0] ? toArray(shape[0]) : undefined,
        shape[1] ? toArray(shape[1]) : undefined,
      ],
    };
  })
  .noUnknown();

export const validator = createSafeValidator(schema, {
  strict: false,
  noUnknown: true,
});
