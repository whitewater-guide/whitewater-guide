import * as cronValidator from 'cron-validator';
import isString from 'lodash/isString';
import * as yup from 'yup';

const cron = () =>
  yup
    .string()
    .defined()
    .test({
      name: 'is-cron',
      message: 'yup:string.cron',
      test(v) {
        return (
          this.schema.isType(v) &&
          (!isString(v) || v === '' || cronValidator.isValidCron(v))
        );
      },
    });

export default cron;
