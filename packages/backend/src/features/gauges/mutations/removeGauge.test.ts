import { ApolloErrorCodes } from '@whitewater-guide/commons';
import { gql } from 'graphql-tag';

import { db, holdTransaction, rollbackTransaction } from '../../../db/index';
import { GorgeConnector } from '../../../features/gorge/index';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '../../../seeds/test/01_users';
import { SOURCE_GALICIA_1 } from '../../../seeds/test/05_sources';
import { GAUGE_GAL_1_1 } from '../../../seeds/test/06_gauges';
import { GALICIA_BECA_LOWER } from '../../../seeds/test/09_sections';
import { anonContext, countRows, fakeContext } from '../../../test/index';
import type { RemoveGaugeMutationResult } from './removeGauge.test.generated';
import { testRemoveGauge } from './removeGauge.test.generated';

jest.mock('../../gorge/connector.ts');

let pBefore: number;
let gBefore: number;
let tBefore: number;

beforeAll(async () => {
  [pBefore, gBefore, tBefore] = await countRows(
    true,
    'points',
    'gauges',
    'gauges_translations',
  );
});

const _mutation = gql`
  mutation removeGauge($id: ID!) {
    removeGauge(id: $id)
  }
`;

const DATA_FIELD = 'removeGauge';

const gal1 = { id: GAUGE_GAL_1_1 };

beforeEach(async () => {
  jest.clearAllMocks();
  await holdTransaction();
});
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await testRemoveGauge(gal1, anonContext());
    expect(result).toHaveGraphqlError(
      ApolloErrorCodes.UNAUTHENTICATED,
      DATA_FIELD,
    );
  });

  it('user should not pass', async () => {
    const result = await testRemoveGauge(gal1, fakeContext(TEST_USER));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN, DATA_FIELD);
  });

  it('editor should not pass', async () => {
    const result = await testRemoveGauge(gal1, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN, DATA_FIELD);
  });
});

describe('effects', () => {
  let result: RemoveGaugeMutationResult;
  let spy: jest.SpyInstance;

  beforeEach(async () => {
    spy = jest.spyOn(GorgeConnector.prototype, 'updateJobForSource');
    result = await testRemoveGauge(gal1, fakeContext(ADMIN));
  });

  afterEach(() => {
    spy.mockReset();
  });

  it('should return deleted gauge id', () => {
    expect(result.errors).toBeUndefined();
    expect(result.data?.removeGauge).toBe(gal1.id);
  });

  it('should remove from tables', async () => {
    const [pAfter, gAfter, tAfter] = await countRows(
      false,
      'points',
      'gauges',
      'gauges_translations',
    );
    expect([pAfter, gAfter, tAfter]).toEqual([
      pBefore - 1,
      gBefore - 1,
      tBefore - 2,
    ]);
  });

  it('should nullify corresponding sections gauge_id', async () => {
    const s = await db()
      .select('gauge_id')
      .from('sections')
      .where({ id: GALICIA_BECA_LOWER })
      .first();
    expect(s.gauge_id).toBeNull();
  });

  it('should update job when gauge is removed', () => {
    expect(spy).toHaveBeenCalledWith(SOURCE_GALICIA_1);
  });
});
