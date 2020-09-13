import { anonContext, fakeContext, runQuery } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';

import { holdTransaction, rollbackTransaction } from '~/db';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '~/seeds/test/01_users';
import { REGION_GALICIA } from '~/seeds/test/04_regions';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
query listGroups($regionId: ID) {
  groups(regionId: $regionId) {
    nodes {
      id
      name
      sku
      regions {
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
  it('should return groups', async () => {
    const result = await runQuery(query, {}, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.groups.nodes).toHaveLength(5);
    expect(result.data!.groups.count).toBe(5);
    expect(result.data!.groups).toMatchSnapshot();
  });

  it('should filter by region', async () => {
    const result = await runQuery(
      query,
      { regionId: REGION_GALICIA },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data!.groups.nodes).toHaveLength(3);
    expect(result.data!.groups.count).toBe(3);
  });

  it('should be able to specify language', async () => {
    const result = await runQuery(query, {}, fakeContext(ADMIN, 'ru'));
    expect(result.errors).toBeUndefined();
    expect(result.data!.groups.nodes).toHaveLength(5);
    expect(result.data!.groups.nodes).toContainEqual(
      expect.objectContaining({ name: 'Европа и СНГ' }),
    );
  });

  it('should fall back to english when not translated', async () => {
    const result = await runQuery(query, {}, fakeContext(ADMIN, 'ru'));
    expect(result.errors).toBeUndefined();
    expect(result.data!.groups.nodes).toHaveLength(5);
    expect(result.data!.groups.nodes).toContainEqual(
      expect.objectContaining({ name: 'Latin America' }),
    );
  });
});
