import { anonContext, fakeContext } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '~/db';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '~/seeds/test/01_users';
import { BANNERS_COUNT } from '~/seeds/test/14_banners';

import { testListBanners } from './banners.test.generated';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const _query = gql`
  query listBanners {
    banners {
      nodes {
        ...BannerCore
        source {
          kind
          url(width: 1000)
          src(width: 1000)
        }
        ...BannerRegions
        ...BannerGroups
      }
      count
    }
  }
`;

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await testListBanners({}, anonContext());
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should not pass', async () => {
    const result = await testListBanners({}, fakeContext(TEST_USER));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editor should not pass', async () => {
    const result = await testListBanners({}, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });
});

describe('data', () => {
  it('should return banners', async () => {
    const result = await testListBanners({}, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data?.banners?.nodes).toHaveLength(BANNERS_COUNT);
    expect(result.data?.banners?.count).toBe(BANNERS_COUNT);
    expect(result.data?.banners).toMatchSnapshot();
  });
});
