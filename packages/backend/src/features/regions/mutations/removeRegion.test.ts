import { anonContext, countRows, fakeContext } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '~/db';
import { ADMIN, EDITOR_NO_EC, TEST_USER } from '~/seeds/test/01_users';
import {
  REGION_ECUADOR,
  REGION_GALICIA,
  REGION_LAOS,
} from '~/seeds/test/04_regions';

import {
  RemoveRegionMutationResult,
  testRemoveRegion,
} from './removeRegion.test.generated';

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

const _mutation = gql`
  mutation removeRegion($id: ID!) {
    removeRegion(id: $id)
  }
`;

const ecuador = { id: REGION_ECUADOR };
const galicia = { id: REGION_GALICIA };

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await testRemoveRegion(ecuador, anonContext());
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should not pass', async () => {
    const result = await testRemoveRegion(ecuador, fakeContext(TEST_USER));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editor should not pass', async () => {
    const result = await testRemoveRegion(ecuador, fakeContext(EDITOR_NO_EC));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('should not remove non-empty region', async () => {
    const result = await testRemoveRegion(galicia, fakeContext(ADMIN));
    expect(result).toHaveGraphqlError(
      ApolloErrorCodes.MUTATION_NOT_ALLOWED,
      '',
    );
  });
});

describe('effects', () => {
  let result: RemoveRegionMutationResult | null;

  beforeEach(async () => {
    result = await testRemoveRegion({ id: REGION_LAOS }, fakeContext(ADMIN));
  });

  afterEach(() => {
    result = null;
  });

  it('should return deleted region id', () => {
    expect(result?.errors).toBeUndefined();
    expect(result?.data?.removeRegion).toBe(REGION_LAOS);
  });

  it('should remove from tables', async () => {
    const [rAfter, rtAfter, rpAfter] = await countRows(
      false,
      'regions',
      'regions_translations',
      'regions_points',
    );
    expect([rBefore - rAfter, rtBefore - rtAfter, rpBefore - rpAfter]).toEqual([
      1, 1, 1,
    ]);
  });
});
