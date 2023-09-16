import * as cronValidator from 'cron-validator';
import type { StringSchema } from 'yup';

export default function cron(this: StringSchema, errorMessage?: string) {
  return this.test({
    name: 'is-cron',
    exclusive: true,
    message: errorMessage ?? 'yup:string.cron',
    test(v) {
      return !v || cronValidator.isValidCron(v);
    },
  });
}
