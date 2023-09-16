import type { MixedSchema } from 'yup';
import { array, mixed, number, string } from 'yup';

import type { FileLike, LocalPhoto } from './types';
import { isLocalPhoto } from './types';
import { validateResolution } from './validateResolution';

const url = string().url().required();
const resolution = array()
  .min(2)
  .max(2)
  .of(number().integer().positive().required());

interface Options {
  mpxOrResolution?: number | [number, number];
  urlRequired?: boolean;
}

export function getLocalPhotoSchema<F extends FileLike = FileLike>(
  options: Options = {},
): MixedSchema<LocalPhoto<F> | null | undefined> {
  const { mpxOrResolution, urlRequired = true } = options;
  return mixed<LocalPhoto<F>>()
    .notRequired()
    .test({
      name: 'is-local-photo',
      message: 'yup:photo.invalid',
      test(v: any) {
        if (v === null || v === undefined) {
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
        const resolutionError = validateResolution(
          v.resolution,
          mpxOrResolution,
        );
        if (resolutionError) {
          return this.createError({ message: resolutionError as any });
        }
        return true;
      },
    });
}
