import { anonContext, fakeContext, runQuery } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';

import { holdTransaction, rollbackTransaction } from '~/db';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '~/seeds/test/01_users';
import { GROUP_ALL } from '~/seeds/test/03_groups';
import { REGION_GALICIA } from '~/seeds/test/04_regions';
import {
  ALL_SECTION_ROW_BANNER,
  GALICIA_REGION_DESCR_BANNER2,
  GALICIA_SECTION_ROW_BANNER,
} from '~/seeds/test/14_banners';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query bannerDetails($id: ID){
    banner(id: $id) {
      id
      name
      slug
      priority
      enabled
      placement
      source {
        kind
        url(width: 1000)
      }
      link
      extras
      regions {
        nodes {
          id
          name
        }
        count
      }
      groups {
        nodes {
          id
          name
        }
        count
      }
    }
  }
`;

describe('permissions', () => {
  it('anon shall fail', async () => {
    const result = await runQuery(
      query,
      { id: GALICIA_SECTION_ROW_BANNER },
      anonContext(),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user shall not pass', async () => {
    const result = await runQuery(
      query,
      { id: GALICIA_SECTION_ROW_BANNER },
      fakeContext(TEST_USER),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editor shall not pass', async () => {
    const result = await runQuery(
      query,
      { id: GALICIA_SECTION_ROW_BANNER },
      fakeContext(EDITOR_GA_EC),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });
});

describe('data', () => {
  it('should return banner', async () => {
    const result = await runQuery(
      query,
      { id: GALICIA_SECTION_ROW_BANNER },
      fakeContext(ADMIN),
    );
    expect(result).not.toHaveGraphqlError();
    expect(result.data!.banner).toMatchSnapshot();
  });

  it('should return null when id not specified', async () => {
    const result = await runQuery(query, {}, fakeContext(ADMIN));
    expect(result).not.toHaveGraphqlError();
    expect(result.data!.banner).toBeNull();
  });

  it('should return thumb', async () => {
    const result = await runQuery(
      query,
      { id: GALICIA_REGION_DESCR_BANNER2 },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data!.banner.source.url).toBe(
      'imgproxy://w:1024/banners/banner_4.jpg',
    );
  });
});

describe('connections', () => {
  describe('regions', () => {
    it('should return nodes', async () => {
      const q = `
      query bannerDetails($id: ID){
        banner(id: $id) {
          id
          name
          slug
          regions {
            count
            nodes {
              id
              name
              __typename
            }
            __typename
          }
          __typename
        }
      }
    `;
      const result = await runQuery(
        q,
        { id: GALICIA_SECTION_ROW_BANNER },
        fakeContext(ADMIN),
      );
      expect(result).not.toHaveGraphqlError();
      const banner = result.data!.banner;
      expect(banner).toMatchObject({
        id: GALICIA_SECTION_ROW_BANNER,
        name: 'galicia section row banner',
        regions: {
          count: 1,
          nodes: [{ id: REGION_GALICIA, name: 'Galicia' }],
        },
      });
    });
  });

  describe('groups', () => {
    it('should return nodes', async () => {
      const q = `
      query bannerDetails($id: ID){
        banner(id: $id) {
          id
          name
          slug
          groups {
            count
            nodes {
              id
              name
              __typename
            }
            __typename
          }
          __typename
        }
      }
    `;
      const result = await runQuery(
        q,
        { id: ALL_SECTION_ROW_BANNER },
        fakeContext(ADMIN),
      );
      expect(result).not.toHaveGraphqlError();
      const banner = result.data!.banner;
      expect(banner).toMatchObject({
        id: ALL_SECTION_ROW_BANNER,
        name: 'all section row banner',
        groups: {
          count: 1,
          nodes: [{ id: GROUP_ALL, name: 'All regions' }],
        },
      });
    });
  });
});
