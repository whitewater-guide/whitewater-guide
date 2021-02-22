import { yupTypes } from '@whitewater-guide/validation';
import isArray from 'lodash/isArray';
import isNumber from 'lodash/isNumber';
import * as yup from 'yup';

import { POITypes } from './POITypes';
import { CoordinateLoose, PointInput } from './types';

export const CoordinateSchema: yup.SchemaOf<CoordinateLoose> = yup
  .array()
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
  });

export const PointInputSchema: yup.SchemaOf<PointInput> = yup
  .object({
    id: yupTypes.uuid().defined().nullable(),
    name: yup.string().nullable(),
    description: yup.string().nullable(),
    coordinates: CoordinateSchema.clone() as any,
    kind: yup.mixed().defined().oneOf(POITypes),
  })
  .strict(true)
  .noUnknown();
