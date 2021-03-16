import { License } from './types';

export type LicenseWithLogo = Omit<License, 'slug'> & {
  slug: string;
};

export interface CommonLicense extends License {
  key: string;
}

export const COMMON_LICENSES: CommonLicense[] = [
  {
    key: 'copyrighted',
    name: 'Copyrighted license',
  },
  {
    key: 'CC_BY',
    slug: 'CC_BY',
    name: 'CC BY 4.0',
    url: 'https://creativecommons.org/licenses/by/4.0/',
  },
  {
    key: 'CC_BY-SA',
    slug: 'CC_BY-SA',
    name: 'CC BY-SA 4.0',
    url: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  {
    key: 'CC_BY-ND',
    slug: 'CC_BY-ND',
    name: 'CC BY-ND 4.0',
    url: 'https://creativecommons.org/licenses/by-nd/4.0/',
  },
  {
    key: 'CC_BY-NC',
    slug: 'CC_BY-NC',
    name: 'CC BY-NC 4.0',
    url: 'https://creativecommons.org/licenses/by-nc/4.0/',
  },
  {
    key: 'CC_BY-NC-SA',
    slug: 'CC_BY-NC-SA',
    name: 'CC BY-NC-SA 4.0',
    url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
  },
  {
    key: 'CC_BY-NC-ND',
    slug: 'CC_BY-NC-ND',
    name: 'CC BY-NC-ND 4.0',
    url: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
  },
  {
    key: 'CC0',
    slug: 'CC0',
    name: 'CC0 1.0',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
];

// This is the default license for any content in the app
export const ROOT_LICENSE: License = {
  slug: 'CC_BY-NC-SA',
  name: 'CC BY-NC-SA 4.0',
  url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
};

/**
 * Returns true if it's possible to display license logo
 * Logo URL is generated from slug, so different versions of license can have same logo
 * @param license
 * @returns
 */
export function isLicenseWithLogo(
  license: License,
): license is LicenseWithLogo {
  const { slug } = license;
  return COMMON_LICENSES.some((l) => !!slug && l.slug === slug);
}
