import * as yup from 'yup';

const SLUG_REGEX = /^[0-9a-zA-Z_-]{3,64}$/;

export default function slug(
  this: yup.StringSchema<any, any, any>,
  errorMessage?: string,
) {
  return this.test({
    name: 'is-slug',
    exclusive: true,
    message: errorMessage ?? 'yup:string.slug',
    test(v) {
      // undefined and null values should be handled by following .required, .nullable, .etc
      // eslint-disable-next-line no-eq-null, eqeqeq
      return v == null || SLUG_REGEX.test(v);
    },
  });
}
