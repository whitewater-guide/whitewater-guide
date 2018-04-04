import { holdTransaction, rollbackTransaction } from '../../../db';
import { ADMIN, EDITOR_GA_EC, EDITOR_GA_EC_ID, EDITOR_NO_EC_ID, TEST_USER } from '../../../seeds/test/01_users';
import { REGION_ECUADOR, REGION_GALICIA } from '../../../seeds/test/04_regions';
import { anonContext, fakeContext } from '../../../test/context';
import { runQuery } from '../../../test/runQuery';

const query = `
  query regionEditors($regionId: ID!){
    regionEditors(regionId: $regionId) {
      id
      name
      email
    }
  }
`;

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  const variables = { regionId: REGION_GALICIA };

  it('anon should fail', async () => {
    const result = await runQuery(query, variables, anonContext());
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.regionEditors', null);
  });

  it('user should fail', async () => {
    const result = await runQuery(query, variables, fakeContext(TEST_USER));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.regionEditors', null);
  });

  it('editor should fail', async () => {
    const result = await runQuery(query, variables, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.regionEditors', null);
  });

});

describe('results', () => {
  it('should find one', async () => {
    const result = await runQuery(query, { regionId: REGION_GALICIA }, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.regionEditors).toHaveLength(1);
    expect(result.data!.regionEditors).toMatchObject([{ id: EDITOR_GA_EC_ID }]);
  });

  it('should find many', async () => {
    const result = await runQuery(query, { regionId: REGION_ECUADOR }, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.regionEditors).toHaveLength(2);
    expect(result.data!.regionEditors).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: EDITOR_GA_EC_ID }),
      expect.objectContaining({ id: EDITOR_NO_EC_ID }),
    ]));
  });
});
