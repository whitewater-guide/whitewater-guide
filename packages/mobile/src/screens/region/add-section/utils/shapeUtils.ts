import { FormikErrors, FormikTouched } from 'formik';
import get from 'lodash/get';
import { Shape } from '../types';

export const isShapeTouched = (touched: FormikTouched<Shape>, index: 0 | 1) =>
  get(touched.shape, `${index}.1`) ||
  get(touched.shape, `${index}.0`) ||
  get(touched.shape, `${index}.2`);

export const getShapeError = (errors: FormikErrors<Shape>, index: 0 | 1) =>
  get(errors.shape, `${index}.1`) ||
  get(errors.shape, `${index}.0`) ||
  get(errors.shape, `${index}.2`) ||
  get(errors.shape, index);
