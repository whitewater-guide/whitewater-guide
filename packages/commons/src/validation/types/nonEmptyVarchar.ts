import isString from 'lodash/isString';
import varchar from './varchar';

const nonEmptyVarchar = () =>
  varchar()
    .defined()
    .test({
      name: 'is-non-empty-varchar',
      message: 'yup:varchar.nonEmpty',
      test(v) {
        return this.schema.isType(v) && (!isString(v) || v.trim().length > 0);
      },
    });

export default nonEmptyVarchar;
