import { anonContext, countRows, fakeContext, runQuery } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';

import { holdTransaction, rollbackTransaction } from '~/db';
import { EDITOR_GA_EC, EDITOR_NO_EC, TEST_USER } from '~/seeds/test/01_users';
import { RIVER_GAL_BECA, RIVER_GAL_CABE } from '~/seeds/test/07_rivers';

let rBefore: number;
let rtBefore: number;

beforeAll(async () => {
  [rBefore, rtBefore] = await countRows(true, 'rivers', 'rivers_translations');
});

const query = `
  mutation removeRiver($id: ID!){
    removeRiver(id: $id)
  }
`;

const riverWithSections = { id: RIVER_GAL_BECA };
const riverWithoutSections = { id: RIVER_GAL_CABE };

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await runQuery(query, riverWithoutSections, anonContext());
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should not pass', async () => {
    const result = await runQuery(
      query,
      riverWithoutSections,
      fakeContext(TEST_USER),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('non-owning editor should not pass', async () => {
    const result = await runQuery(
      query,
      riverWithoutSections,
      fakeContext(EDITOR_NO_EC),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });
});

describe('effects', () => {
  it('should not remove river which has sections', async () => {
    const result = await runQuery(
      query,
      riverWithSections,
      fakeContext(EDITOR_GA_EC),
    );
    expect(result).toHaveGraphqlError(
      ApolloErrorCodes.MUTATION_NOT_ALLOWED,
      'Delete all sections first!',
    );
  });

  it('should return deleted river id', async () => {
    const result = await runQuery(
      query,
      riverWithoutSections,
      fakeContext(EDITOR_GA_EC),
    );
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.removeRiver', riverWithoutSections.id);
  });

  it('should remove from tables', async () => {
    await runQuery(query, riverWithoutSections, fakeContext(EDITOR_GA_EC));
    const [rAfter, rtAfter] = await countRows(
      false,
      'rivers',
      'rivers_translations',
    );
    expect(rBefore - rAfter).toBe(1);
    expect(rtBefore - rtAfter).toBe(1);
  });
});
