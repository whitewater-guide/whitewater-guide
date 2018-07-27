import { holdTransaction, rollbackTransaction } from '@db';
import { ADMIN, ADMIN_ID, EDITOR_GA_EC, EDITOR_GA_EC_ID, TEST_USER } from '@seeds/01_users';
import { REGION_GALICIA } from '@seeds/04_regions';
import { anonContext, countRows, fakeContext, runQuery } from '@test';

let reBefore: number;

beforeAll(async () => {
  [reBefore] = await countRows(true, 'regions_editors');
});

const mutation = `
  mutation addEditor($regionId: ID!, $userId: ID!){
    addEditor(regionId: $regionId, userId: $userId)
  }
`;

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  const variables = { regionId: REGION_GALICIA, userId: ADMIN_ID };

  it('anon should fail', async () => {
    const result = await runQuery(mutation, variables, anonContext());
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.addEditor', null);
  });

  it('user should fail', async () => {
    const result = await runQuery(mutation, variables, fakeContext(TEST_USER));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.addEditor', null);
  });

  it('editor should fail', async () => {
    const result = await runQuery(mutation, variables, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.addEditor', null);
  });

});

describe('effects', () => {
  it('should increase count by one', async () => {
    const result = await runQuery(mutation, { regionId: REGION_GALICIA, userId: ADMIN_ID }, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.addEditor).toBe(true);
    const [reAfter] = await countRows(false, 'regions_editors');
    expect(reAfter - reBefore).toBe(1);
  });

  it('should ignore dupes', async () => {
    const result = await runQuery(mutation, { regionId: REGION_GALICIA, userId: EDITOR_GA_EC_ID }, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.addEditor).toBe(true);
    const [reAfter] = await countRows(false, 'regions_editors');
    expect(reAfter - reBefore).toBe(0);
  });
});
