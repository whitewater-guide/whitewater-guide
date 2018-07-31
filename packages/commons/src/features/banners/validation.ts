import isNumber from 'lodash/isNumber';
import { customStruct } from '../../utils/validation';
import { BannerKind, BannerPlacement } from './types';

const struct = customStruct({
  ratio: (value: any) => {
    if (!isNumber(value)) {
      return 'Ratio must be a number';
    }
    if (value > 10 || value < 3) {
      return 'Ratio must be a number between 10 and 3';
    }
    return true;
  },
});

const BannerSourceStruct = struct.object({
  kind: struct.enum(Object.values(BannerKind)),
  ratio: 'ratio|null',
  src: 'nonEmptyString',
});

export const BannerInputStruct = struct.object({
  id: 'uuid|null',
  slug: 'slug',
  name: 'nonEmptyString',
  priority: 'integer',
  enabled: 'boolean',
  placement: struct.enum(Object.values(BannerPlacement)),
  source: BannerSourceStruct,
  link: 'https|null',
  extras: 'object|null',
  regions: ['node'],
  groups: ['node'],
});
