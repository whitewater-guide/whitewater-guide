import { Parser } from 'expr-eval';
import * as yup from 'yup';

export default function formula(
  this: yup.StringSchema<any, any, any>,
  errorMessage?: string,
) {
  return this.test({
    name: 'is-formula',
    exclusive: true,
    message: errorMessage ?? 'yup:string.formula',
    test(v) {
      // undefined and null values should be handled by following .required, .nullable, .etc
      // eslint-disable-next-line no-eq-null, eqeqeq
      if (v == null) {
        return true;
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
}
