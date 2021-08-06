import * as cronValidator from 'cron-validator';
import * as yup from 'yup';

export default function cron(
  this: yup.StringSchema<any, any, any>,
  errorMessage?: string,
) {
  return this.test({
    name: 'is-cron',
    exclusive: true,
    message: errorMessage ?? 'yup:string.cron',
    test(v) {
      return !v || cronValidator.isValidCron(v);
    },
  });
}
