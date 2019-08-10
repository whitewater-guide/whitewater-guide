import isString from 'lodash/isString';
import isUUID from 'validator/lib/isUUID';
import * as yup from 'yup';

const uuid = () =>
  yup
    .string()
    .defined()
    .test({
      name: 'is-uuid',
      message: 'yup:string.uuid',
      test(v) {
        return this.schema.isType(v) && (!isString(v) || isUUID(v));
      },
    });

export default uuid;
