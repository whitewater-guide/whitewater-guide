import isString from 'lodash/isString';
import * as yup from 'yup';

const nonEmptyString = () =>
  yup
    .string()
    .typeError('yup:string.nonEmpty')
    .test({
      name: 'is-non-empty-string',
      message: 'yup:string.nonEmpty',
      test(v) {
        if (v === null) {
          return !!this.schema.isType(v);
        }
        if (!v) {
          return false;
        }
        return isString(v) && v.trim().length > 0;
      },
    });

export default nonEmptyString;
