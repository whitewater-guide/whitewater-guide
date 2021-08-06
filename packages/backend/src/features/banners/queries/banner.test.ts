import { fakeContext } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '~/db';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '~/seeds/test/01_users';
import { GROUP_ALL } from '~/seeds/test/03_groups';
import { REGION_GALICIA } from '~/seeds/test/04_regions';
import {
  ALL_SECTION_ROW_BANNER,
  GALICIA_REGION_DESCR_BANNER2,
  GALICIA_SECTION_ROW_BANNER,
} from '~/seeds/test/14_banners';

import {
  testBannerDetails,
  testBannerGroups,
  testBannerRegions,
} from './banner.test.generated';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const _query = gql`
  query bannerDetails($id: ID) {
    banner(id: $id) {
      ...BannerCore
      ...BannerRegions
      ...BannerGroups
      source {
        kind
        url(width: 1000)
      }
    }
  }
`;

describe('permissions', () => {
  it('anon shall fail', async () => {
    const result = await testBannerDetails();
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user shall not pass', async () => {
    const result = await testBannerDetails(
      { id: GALICIA_SECTION_ROW_BANNER },
      fakeContext(TEST_USER),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editor shall not pass', async () => {
    const result = await testBannerDetails(
      { id: GALICIA_SECTION_ROW_BANNER },
      fakeContext(EDITOR_GA_EC),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });
});

describe('data', () => {
  it('should return banner', async () => {
    const result = await testBannerDetails(
      { id: GALICIA_SECTION_ROW_BANNER },
      fakeContext(ADMIN),
    );
    expect(result).not.toHaveGraphqlError();
    expect(result.data?.banner).toMatchSnapshot();
  });

  it('should return null when id not specified', async () => {
    const result = await testBannerDetails({}, fakeContext(ADMIN));
    expect(result).not.toHaveGraphqlError();
    expect(result.data?.banner).toBeNull();
  });

  it('should return thumb', async () => {
    const result = await testBannerDetails(
      { id: GALICIA_REGION_DESCR_BANNER2 },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.banner?.source.url).toBe(
      'imgproxy://w:1024/banners/banner_4.jpg',
    );
  });
});

describe('connections', () => {
  it('should return regions', async () => {
    const _q = gql`
      query bannerRegions($id: ID) {
        banner(id: $id) {
          id
          name
          slug
          ...BannerRegions
        }
      }
    `;
    const result = await testBannerRegions(
      { id: GALICIA_SECTION_ROW_BANNER },
      fakeContext(ADMIN),
    );
    expect(result).not.toHaveGraphqlError();
    expect(result.data?.banner).toMatchObject({
      id: GALICIA_SECTION_ROW_BANNER,
      name: 'galicia section row banner',
      regions: {
        count: 1,
        nodes: [{ id: REGION_GALICIA, name: 'Galicia' }],
      },
    });
  });

  it('should return groups', async () => {
    const _q = gql`
      query bannerGroups($id: ID) {
        banner(id: $id) {
          id
          name
          slug
          ...BannerGroups
        }
      }
    `;
    const result = await testBannerGroups(
      { id: ALL_SECTION_ROW_BANNER },
      fakeContext(ADMIN),
    );
    expect(result).not.toHaveGraphqlError();
    expect(result.data?.banner).toMatchObject({
      id: ALL_SECTION_ROW_BANNER,
      name: 'all section row banner',
      groups: {
        count: 1,
        nodes: [{ id: GROUP_ALL, name: 'All regions' }],
      },
    });
  });
});
