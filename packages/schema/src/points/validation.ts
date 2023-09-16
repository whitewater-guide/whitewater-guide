import { isArray, isNumber } from 'lodash';
import type { ObjectSchema, Schema } from 'yup';
import { array, object, string } from 'yup';

import type { PointInput } from '../__generated__/types';
import { POITypes } from './POITypes';

export const CoordinateSchema: Schema<CodegenCoordinates> = array()
  .max(3)
  .test({
    name: 'is-coordinate3d-lng',
    test(v) {
      const valid = isArray(v) && isNumber(v[0]) && v[0] >= -180 && v[0] <= 180;
      const path = this.path ? `${this.path}.0` : '0';
      return (
        valid || this.createError({ path, message: 'yup:number.longitude' })
      );
    },
  })
  .test({
    name: 'is-coordinate3d-lat',
    test(v) {
      const valid = isArray(v) && isNumber(v[1]) && v[1] >= -90 && v[1] <= 90;
      const path = this.path ? `${this.path}.1` : '1';
      return (
        valid || this.createError({ path, message: 'yup:number.latitude' })
      );
    },
  })
  .test({
    name: 'is-coordinate3d-alt',
    test(v) {
      const path = this.path ? `${this.path}.2` : '2';
      return (
        (isArray(v) &&
          (v[2] === undefined || v[2] === null || isNumber(v[2]))) ||
        this.createError({ path, message: 'yup:number.altitude' })
      );
    },
  }) as any;

export const PointInputSchema: ObjectSchema<PointInput> = object({
  id: string().uuid().defined().nullable(),
  name: string().nullable(),
  description: string().nullable(),
  coordinates: CoordinateSchema.clone(),
  kind: string().defined().oneOf(POITypes),
})
  .strict(true)
  .noUnknown();
