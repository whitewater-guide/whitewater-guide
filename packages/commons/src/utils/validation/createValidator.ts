import set from 'lodash/set';
import { Kind } from 'superstruct';

export const createValidator = (struct: Kind) => (value: any): object | null => {
  const [error] = struct.validate(value);
  if (error) {
    const errors = {};
    error.errors.forEach((err: any) => set(errors, err.path, err.reason || 'Incorrect value'));
    return errors;
  } else {
    return null;
  }
};
