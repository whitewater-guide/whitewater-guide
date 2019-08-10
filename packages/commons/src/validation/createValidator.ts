import * as yup from 'yup';
import { yupToFormErrors } from './yupToFormErrors';

interface ValidatorOptions {
  strict?: boolean;
  noUnknown?: boolean;
}

export const createValidator = (
  schema: yup.Schema<any>,
  options: ValidatorOptions = {},
) => {
  const { strict = true, noUnknown = true } = options;
  const isObjectSchema = schema instanceof yup.object;
  const actualSchema =
    isObjectSchema && noUnknown
      ? (schema as yup.ObjectSchema).clone().noUnknown()
      : schema;

  const opts: yup.ValidateOptions = {
    abortEarly: false,
    stripUnknown: false,
  };
  // avoid setting undefined as it will override .strict() from schema
  if (strict) {
    opts.strict = true;
  }

  return (value: any) => actualSchema.validateSync(value, opts);
};

export const createSafeValidator = (
  schema: yup.Schema<any>,
  options: ValidatorOptions = {},
) => {
  const throwingValidator = createValidator(schema, options);
  return (value: any) => {
    try {
      throwingValidator(value);
      return null;
    } catch (e) {
      return yupToFormErrors(e);
    }
  };
};
