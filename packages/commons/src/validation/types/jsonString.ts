import isString from 'lodash/isString';
import isJSON from 'validator/lib/isJSON';
import * as yup from 'yup';

const jsonString = () =>
  yup
    .string()
    .defined()
    .test({
      name: 'is-json-string',
      message: 'yup:string.json',
      test(v) {
        return this.schema.isType(v) && (!isString(v) || isJSON(v));
      },
    });

export default jsonString;
