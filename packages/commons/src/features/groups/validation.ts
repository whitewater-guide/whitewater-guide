import isString from 'lodash/isString';
import { customStruct } from '../../utils/validation';

const GROUP_SKU = /^group\.\w{3,}$/;

const struct = customStruct({
  sku: (value: any) => {
    if (!isString(value) || value.length > 255) {
      return 'SKU must be string no longer than 255 chars';
    }
    if (!GROUP_SKU.test(value)) {
      return 'SKU must start with "group." and contain at least 3 word characters after dot';
    }
    return true;
  },
});

export const GroupInputStruct = struct.object({
  id: struct.union(['uuid', 'null']),
  name: 'nonEmptyString',
  sku: struct.union(['sku', 'null']),
});
