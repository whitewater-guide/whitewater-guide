import type { ObjectSchema, Schema, ValidationError } from 'yup';

import type { Errors } from './yupToFormErrors';
import { yupToFormErrors } from './yupToFormErrors';

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

function isObjectSchema(schema: Schema<unknown>): schema is ObjectSchema<any> {
  return schema._type === 'object';
}

export function createValidator(
  schema: Schema<any>,
  options: ValidatorOptions = {},
) {
  const { strict = true, noUnknown = true } = options;

  const actualSchema =
    isObjectSchema(schema) && noUnknown
      ? (schema.clone() as ObjectSchema<any>).noUnknown()
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
  schema: Schema<T>,
  options: ValidatorOptions = {},
) {
  const throwingValidator = createValidator(schema, options);
  return (value: any): Errors<T> | null => {
    try {
      throwingValidator(value);
      return null;
    } catch (e) {
      return yupToFormErrors(e as ValidationError);
    }
  };
}
