import type { FormikErrors, FormikTouched } from 'formik';
import get from 'lodash/get';

import type { Shape } from '../types';

export function isShapeTouched(
  touched: FormikTouched<Shape>,
  index: 0 | 1,
): boolean {
  const touchedAt = (touched?.shape as any)?.[index];
  return (touchedAt?.[0] && touchedAt?.[1]) || touchedAt?.[2];
}

export function getShapeError(
  errors: FormikErrors<Shape>,
  index: 0 | 1,
): string | undefined {
  return (
    get(errors.shape, `${index}.1`) ||
    get(errors.shape, `${index}.0`) ||
    get(errors.shape, `${index}.2`) ||
    get(errors.shape, index)
  );
}
