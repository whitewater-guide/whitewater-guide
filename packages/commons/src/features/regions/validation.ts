import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import { Type } from 'superstruct';
import { customStruct } from '../../utils/validation';
import { CoordinateStruct, PointInputStruct } from '../points';

const REGION_SKU = /^region\.\w{3,}$/;

const struct = customStruct({
  boundsArray: (v: any) =>
    (isArray(v) && v.length >= 3) || 'Minimum length is 3',
  sku: (value: any) => {
    if (!isString(value) || value.length > 255) {
      return 'SKU must be string no longer than 255 chars';
    }
    if (!REGION_SKU.test(value)) {
      return 'SKU must start with "region." and contain at least 3 word characters after dot';
    }
    return true;
  },
});

const RegionInputFields = {
  id: 'uuid|null',
  name: 'nonEmptyString',
  description: 'string|null',
  season: 'string|null',
  seasonNumeric: struct.intersection([['halfMonth'], 'seasonNumeric']),
  bounds: struct.intersection(['boundsArray', [CoordinateStruct]]),
  pois: [PointInputStruct],
};

export const RegionInputStruct = struct.object(RegionInputFields);

export const RegionFormStruct = (richTextStruct?: Type) =>
  struct.object({
    ...RegionInputFields,
    description: richTextStruct || 'any',
  });

export const RegionCoverImageStruct = struct.object({
  mobile: 'nonEmptyString|null',
});

export const RegionAdminSettingsStruct = struct.object({
  id: 'uuid',
  hidden: 'boolean',
  premium: 'boolean',
  sku: 'sku|null',
  mapsSize: 'integer',
  coverImage: RegionCoverImageStruct,
});
