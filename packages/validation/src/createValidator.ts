/* eslint-disable @typescript-eslint/no-explicit-any */
import * as yup from 'yup';

import { Errors, yupToFormErrors } from './yupToFormErrors';

interface ValidatorOptions {
  strict?: boolean;
  noUnknown?: boolean;
}

// yup doesn't export it properly
interface YupValidationOpts {
  strict?: boolean;
  abortEarly?: boolean;
  stripUnknown?: boolean;
  recursive?: boolean;
}

function isObjectSchema(
  schema: yup.SchemaOf<unknown>,
): schema is yup.ObjectSchema<any> {
  return schema._type === 'object';
}

export function createValidator(
  schema: yup.SchemaOf<any>,
  options: ValidatorOptions = {},
) {
  const { strict = true, noUnknown = true } = options;

  const actualSchema =
    isObjectSchema(schema) && noUnknown
      ? (schema.clone() as yup.ObjectSchema<any>).noUnknown()
      : schema;

  const opts: YupValidationOpts = {
    abortEarly: false,
    stripUnknown: false,
  };
  // avoid setting undefined as it will override .strict() from schema
  if (strict) {
    opts.strict = true;
  }

  return (value: any) => actualSchema.validateSync(value, opts);
}

export function createSafeValidator<T>(
  schema: yup.SchemaOf<T>,
  options: ValidatorOptions = {},
) {
  const throwingValidator = createValidator(schema, options);
  return (value: any): Errors<T> | null => {
    try {
      throwingValidator(value);
      return null;
    } catch (e) {
      return yupToFormErrors(e);
    }
  };
}
