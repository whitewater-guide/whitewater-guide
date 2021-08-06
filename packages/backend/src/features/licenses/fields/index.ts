import { LicenseResolvers } from '~/apollo';

const licenseResolvers: LicenseResolvers = {
  slug: (license) => license.slug ?? null,
  url: (license) => license.url ?? null,
};

export default licenseResolvers;
