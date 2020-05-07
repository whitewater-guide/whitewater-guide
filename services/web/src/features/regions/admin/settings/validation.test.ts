import { RegionAdminFormData } from './types';
import { RegionAdminFormSchema } from './validation';
import { createSafeValidator } from '@whitewater-guide/validation';

it('should support null cover', () => {
  const validator = createSafeValidator(RegionAdminFormSchema);
  const value: RegionAdminFormData = {
    coverImage: null,
    hidden: true,
    id: '166cb560-fee6-11e9-8f0b-362b9e155667',
    mapsSize: 0,
    premium: false,
    sku: null,
  };
  expect(validator(value)).toBeNull();
});
