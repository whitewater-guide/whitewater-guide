import type { StringSchema } from 'yup';

export default function https(this: StringSchema, errorMessage?: string) {
  return this.test({
    name: 'is-https',
    exclusive: true,
    message: errorMessage ?? 'yup:string.https',
    test(v) {
      // undefined and null values should be handled by following .required, .nullable, .etc
      // eslint-disable-next-line no-eq-null, eqeqeq
      return v == null || v.indexOf('https://') === 0;
    },
  });
}
