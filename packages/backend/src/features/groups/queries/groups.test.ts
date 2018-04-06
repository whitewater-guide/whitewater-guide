import { holdTransaction, rollbackTransaction } from '../../../db';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '../../../seeds/test/01_users';
import { REGION_GALICIA } from '../../../seeds/test/04_regions';
import { anonContext, fakeContext } from '../../../test/context';
import { runQuery } from '../../../test/db-helpers';
import { UUID_REGEX } from '../../../test/isUUID';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
query listGroups($regionId: ID) {
  groups(regionId: $regionId) {
    id
    name
    regions {
      nodes {
        id
        name
      }
      count
    }
  }
}
`;

describe('resolvers chain', () => {

  it('anon should not pass', async () => {
    const result = await runQuery(query, {}, anonContext());
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.groups', null);
  });

  it('user should not pass', async () => {
    const result = await runQuery(query, {}, fakeContext(TEST_USER));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.groups', null);
  });

  it('editor should not pass', async () => {
    const result = await runQuery(query, {}, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.groups', null);
  });
});

describe('data', () => {
  it('should return groups', async () => {
    const result = await runQuery(query, {}, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.groups).toHaveLength(4);
    expect(result.data!.groups).toMatchSnapshot();
  });

  it('should filter by region', async () => {
    const result = await runQuery(query, { regionId: REGION_GALICIA }, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.groups).toHaveLength(2);
  });

  it('should be able to specify language', async () => {
    const result = await runQuery(query, {}, fakeContext(ADMIN, 'ru'));
    expect(result.errors).toBeUndefined();
    expect(result.data!.groups).toHaveLength(4);
    expect(result.data!.groups.map((g: any) => g.name)).toContainEqual(
      'Европа и СНГ',
    );
  });

  it('should fall back to english when not translated', async () => {
    const result = await runQuery(query, {}, fakeContext(ADMIN, 'ru'));
    expect(result.errors).toBeUndefined();
    expect(result.data!.groups).toHaveLength(4);
    expect(result.data!.groups.map((g: any) => g.name)).toContainEqual(
      'Latin America',
    );
  });
});
