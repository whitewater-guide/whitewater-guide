import { ApolloErrorCodes } from '@whitewater-guide/commons';
import { holdTransaction, rollbackTransaction } from '~/db';
import { ADMIN, EDITOR_NO_EC, TEST_USER } from '~/seeds/test/01_users';
import {
  REGION_ECUADOR,
  REGION_GALICIA,
  REGION_LAOS,
} from '~/seeds/test/04_regions';
import { anonContext, countRows, fakeContext, runQuery } from '~/test';

let rpBefore: number;
let rBefore: number;
let rtBefore: number;

beforeAll(async () => {
  [rBefore, rtBefore, rpBefore] = await countRows(
    true,
    'regions',
    'regions_translations',
    'regions_points',
  );
});

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  mutation removeRegion($id: ID!){
    removeRegion(id: $id)
  }
`;

const ecuador = { id: REGION_ECUADOR };
const galicia = { id: REGION_GALICIA };

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await runQuery(query, ecuador, anonContext());
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should not pass', async () => {
    const result = await runQuery(query, ecuador, fakeContext(TEST_USER));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editor should not pass', async () => {
    const result = await runQuery(query, ecuador, fakeContext(EDITOR_NO_EC));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('should not remove non-empty region', async () => {
    const result = await runQuery(query, galicia, fakeContext(ADMIN));
    expect(result).toHaveGraphqlError(
      ApolloErrorCodes.MUTATION_NOT_ALLOWED,
      '',
    );
  });
});

describe('effects', () => {
  let result: any;

  beforeEach(async () => {
    result = await runQuery(query, { id: REGION_LAOS }, fakeContext(ADMIN));
  });

  afterEach(() => {
    result = null;
  });

  it('should return deleted region id', () => {
    expect(result.errors).toBeUndefined();
    expect(result.data.removeRegion).toBe(REGION_LAOS);
  });

  it('should remove from tables', async () => {
    const [rAfter, rtAfter, rpAfter] = await countRows(
      false,
      'regions',
      'regions_translations',
      'regions_points',
    );
    expect([rBefore - rAfter, rtBefore - rtAfter, rpBefore - rpAfter]).toEqual([
      1,
      1,
      1,
    ]);
  });
});
