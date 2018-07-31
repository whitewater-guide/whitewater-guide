import set from 'lodash/set';
import { Kind, StructError } from 'superstruct';

const buildErrorTree = (error: StructError, result: object) => {
  const { reason, message, errors, path } = error;
  if (errors) {
    errors.forEach((err: StructError) => {
      if (err !== error) {
        buildErrorTree(err, result);
      }
    });
  }
  set(result, path, reason || message || 'Incorrect value');
  return result;
};

export const createValidator = (struct: Kind) => (value: any): object | null => {
  const [error] = struct.validate(value);
  if (error) {
    return buildErrorTree(error, {});
  } else {
    return null;
  }
};
