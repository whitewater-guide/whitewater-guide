import * as yup from 'yup';

export default function nonEmptyString(
  this: yup.StringSchema<any, any, any>,
  errorMessage?: string,
) {
  return this.test({
    exclusive: true,
    message: errorMessage ?? 'yup:string.nonEmpty',
    name: 'is-non-empty-string',
    test(v) {
      return !!v && (v as string).trim().length > 0;
    },
  });
}
