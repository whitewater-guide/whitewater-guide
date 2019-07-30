import isString from 'lodash/isString';
import * as yup from 'yup';

const https = () =>
  yup
    .string()
    .url()
    .defined()
    .test({
      name: 'is-https',
      message: 'yup:string.https',
      test(v) {
        return (
          this.schema.isType(v) && (!isString(v) || v.indexOf('https://') === 0)
        );
      },
    });

export default https;
