import * as yup from 'yup';
import { isLocalPhoto } from './types';
import { validateResolution } from './validateResolution';

const url = yup
  .string()
  .url()
  .required();
const resolution = yup
  .array()
  .min(2)
  .max(2)
  .of(
    yup
      .number()
      .integer()
      .required(),
  );

interface Options {
  mpxOrResolution?: number | [number, number];
  urlRequired?: boolean;
  nullable?: boolean;
}

export const getLocalPhotoSchema = (options: Options = {}) => {
  const { mpxOrResolution, urlRequired = true, nullable } = options;
  return yup.mixed().test({
    name: 'is-local-photo',
    message: 'yup:photo.invalid',
    test(v: any) {
      if (nullable && v === null) {
        return true;
      }
      if (!isLocalPhoto(v)) {
        return false;
      }
      if (v.error) {
        return this.createError({ message: v.error as any });
      }
      if (urlRequired && (!v.url || !url.isValidSync(v.url))) {
        return this.createError({ message: 'yup:photo.invalidURL' });
      }
      if (!resolution.isValidSync(v.resolution)) {
        return this.createError({ message: 'yup:photo.invalidResolution' });
      }
      const resolutionError = validateResolution(v.resolution, mpxOrResolution);
      if (resolutionError) {
        return this.createError({ message: resolutionError as any });
      }
      return true;
    },
  });
};
