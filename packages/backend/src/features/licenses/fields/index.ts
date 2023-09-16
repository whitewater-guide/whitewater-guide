import type { LicenseResolvers } from '../../../apollo/index';

const licenseResolvers: LicenseResolvers = {
  slug: (license) => license.slug ?? null,
  url: (license) => license.url ?? null,
};

export default licenseResolvers;
