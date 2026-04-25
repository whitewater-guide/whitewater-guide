import type { FormikErrors, FormikTouched } from 'formik';
import get from 'lodash/get';

interface ShapeContainer {
  shape?: unknown;
}

export function isShapeTouched(
  touched: FormikTouched<ShapeContainer>,
  index: 0 | 1,
): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const touchedAt = (touched?.shape as any)?.[index];
  return (touchedAt?.[0] && touchedAt?.[1]) || touchedAt?.[2];
}

export function getShapeError(
  errors: FormikErrors<ShapeContainer>,
  index: 0 | 1,
): string | undefined {
  return (
    get(errors.shape, `${index}.1`) ||
    get(errors.shape, `${index}.0`) ||
    get(errors.shape, `${index}.2`) ||
    (get(errors.shape, index) as string | undefined)
  );
}
