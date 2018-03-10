// tslint:disable-next-line
import * as Joi from 'joi';
import { set } from 'lodash';

export const validateInput = (schema: Joi.Schema) => (input: any) => {
  const { error } = Joi.validate(
    input,
    schema,
    {
      noDefaults: true,
      stripUnknown: { objects: true, arrays: false },
      presence: 'required',
      abortEarly: false,
      convert: false,
    },
  );
  const errors = {};
  if (error) {
    error.details.forEach((err: Joi.ValidationErrorItem) => set(errors, err.path, err.message));
  }
  return errors;
};
