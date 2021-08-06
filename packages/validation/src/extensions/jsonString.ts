import isJSON from 'validator/lib/isJSON';
import * as yup from 'yup';

export default function jsonString(
  this: yup.StringSchema<any, any, any>,
  errorMessage?: string,
) {
  return this.test({
    name: 'is-json-string',
    exclusive: true,
    message: errorMessage ?? 'yup:string.json',
    test(v) {
      // undefined and null values should be handled by following .required, .nullable, .etc
      // eslint-disable-next-line no-eq-null, eqeqeq
      return v == null || isJSON(v);
    },
  });
}
