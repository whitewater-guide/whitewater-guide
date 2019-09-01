import isArray from 'lodash/isArray';
import isNumber from 'lodash/isNumber';
import * as yup from 'yup';
import { yupTypes } from '../../validation';
import { POITypes } from './POITypes';
import { Coordinate3d, PointInput } from './types';

export const CoordinateSchema: yup.Schema<Coordinate3d> = yup
  .array<any>()
  .of(yup.number())
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
        (isArray(v) && isNumber(v[2])) ||
        this.createError({ path, message: 'yup:number.altitude' })
      );
    },
  }) as any;

export const CoordinateSchemaLoose = yup
  .array<any>()
  .of(yup.number())
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
        (isArray(v) && (v[2] === undefined || isNumber(v[2]))) ||
        this.createError({ path, message: 'yup:number.altitude' })
      );
    },
  });

export const PointInputSchema = yup
  .object<PointInput>({
    id: yupTypes.uuid(true),
    name: yup.string().nullable(),
    description: yup.string().nullable(),
    coordinates: CoordinateSchema.clone(),
    kind: yup.mixed().oneOf(POITypes),
  })
  .strict(true)
  .noUnknown();
