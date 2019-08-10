import { Parser } from 'expr-eval';
import isString from 'lodash/isString';
import * as yup from 'yup';

const formula = () =>
  yup.string().test({
    name: 'is-formula',
    message: 'yup:string.formula',
    test(v) {
      if (!v) {
        return true;
      }
      if (!isString(v)) {
        // nullable
        return false;
      }
      try {
        const expression = Parser.parse(v);
        const variables = expression.variables({ withMembers: true });
        return variables.length === 1 && variables.indexOf('x') === 0;
      } catch (e) {
        return false;
      }
    },
  });

export default formula;
