import type { StringSchema } from 'yup';

export default function nonEmptyString(
  this: StringSchema,
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
