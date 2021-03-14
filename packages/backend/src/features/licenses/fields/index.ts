import { License } from '@whitewater-guide/commons';

import { FieldResolvers } from '~/apollo';

import { LicenseRaw } from '../types';

const licenseResolvers: FieldResolvers<LicenseRaw, License> = {
  slug: (license) => license.slug ?? null,
  url: (license) => license.url ?? null,
};

export default licenseResolvers;
