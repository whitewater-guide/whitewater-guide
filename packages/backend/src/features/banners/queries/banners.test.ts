import { anonContext, fakeContext, runQuery } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';

import { holdTransaction, rollbackTransaction } from '~/db';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '~/seeds/test/01_users';
import { BANNERS_COUNT } from '~/seeds/test/14_banners';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
query listBanners {
  banners {
    nodes {
      id
      name
      slug
      priority
      enabled
      placement
      source {
        kind
        url(width: 1000)
        src(width: 1000)
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
    count
  }
}
`;

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await runQuery(query, {}, anonContext());
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should not pass', async () => {
    const result = await runQuery(query, {}, fakeContext(TEST_USER));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editor should not pass', async () => {
    const result = await runQuery(query, {}, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });
});

describe('data', () => {
  it('should return banners', async () => {
    const result = await runQuery(query, {}, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.banners.nodes).toHaveLength(BANNERS_COUNT);
    expect(result.data!.banners.count).toBe(BANNERS_COUNT);
    expect(result.data!.banners).toMatchSnapshot();
  });
});
