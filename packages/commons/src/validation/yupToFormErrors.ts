import set from 'lodash/set';

export const yupToFormErrors = (yupError: any) => {
  const errors: Record<string, any> = {};
  if (yupError.inner.length === 0) {
    set(errors, yupError.path, yupError.message);
    return errors;
  }
  for (const err of yupError.inner) {
    if (!(errors as any)[err.path]) {
      set(errors, err.path, err.message);
    }
  }
  return errors;
};
