import set from 'lodash/set';
import type { ValidationError } from 'yup';
/**
 * Copied from Formik
 * https://github.com/formium/formik/blob/master/packages/formik/src/types.tsx
 * An object containing error messages whose keys correspond to FormikValues.
 * Should always be an object of strings, but any is allowed to support i18n libraries.
 */
export type Errors<Values> = {
  [K in keyof Values]?: Values[K] extends any[]
    ? Values[K][number] extends object // [number] is the special sauce to get the type of array's element. More here https://github.com/Microsoft/TypeScript/pull/21316
      ? Errors<Values[K][number]>[] | string | string[]
      : string | string[]
    : Values[K] extends object
    ? Errors<Values[K]>
    : string;
};

export function yupToFormErrors<Values>(
  yupError: ValidationError,
): Errors<Values> {
  const errors: Errors<Values> = {};
  if (yupError.inner.length === 0) {
    if (yupError.path) {
      set(errors, yupError.path, yupError.message);
    }
    return errors;
  }
  for (const err of yupError.inner) {
    if (err.path !== undefined && !(errors as any)[err.path]) {
      set(errors, err.path, err.message);
    }
  }

  return errors;
}
