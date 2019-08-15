import isString from 'lodash/isString';
import isUUID from 'validator/lib/isUUID';
import * as yup from 'yup';

const uuid = (allowNull = false, allowUndefined = false) =>
  yup.mixed().test({
    name: 'is-uuid',
    message: 'yup:string.uuid',
    test(v) {
      if (v === null) {
        return allowNull;
      }
      if (v === undefined) {
        return allowUndefined;
      }
      return isString(v) && isUUID(v);
    },
  });

export default uuid;
