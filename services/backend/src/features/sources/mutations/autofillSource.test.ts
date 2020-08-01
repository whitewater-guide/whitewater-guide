import db, { holdTransaction, rollbackTransaction } from '~/db';
import { GorgeConnector } from '~/features/gorge';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '~/seeds/test/01_users';
import { SOURCE_GALICIA_1, SOURCE_RUSSIA } from '~/seeds/test/05_sources';
import { GAUGE_GAL_1_1 } from '~/seeds/test/06_gauges';
import {
  anonContext,
  countRows,
  fakeContext,
  noUnstable,
  runQuery,
} from '~/test';
import { ApolloErrorCodes, Gauge } from '@whitewater-guide/commons';
import { ExecutionResult } from 'graphql';

jest.mock('../../gorge/connector');

interface TData {
  autofillSource: Gauge[];
}

const mutation = `
  mutation autofillSource($id: ID!){
    autofillSource(id: $id) {
      id
      name
      code
      location {
        id
        kind
        coordinates
      }
      levelUnit
      flowUnit
      requestParams
      url
      createdAt
      updatedAt
      source {
        id
        name
      }
    }
  }
`;

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
  jest.resetAllMocks();
});

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await runQuery(
      mutation,
      { id: SOURCE_GALICIA_1 },
      anonContext(),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should not pass', async () => {
    const result = await runQuery(
      mutation,
      { id: SOURCE_GALICIA_1 },
      fakeContext(TEST_USER),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editor should not pass', async () => {
    const result = await runQuery(
      mutation,
      { id: SOURCE_GALICIA_1 },
      fakeContext(EDITOR_GA_EC),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });
});

describe('errors', () => {
  it('should fail when script fails', async () => {
    jest
      .spyOn(GorgeConnector.prototype, 'listGauges')
      .mockRejectedValueOnce(new Error('boom'));
    const result = await runQuery(
      mutation,
      { id: SOURCE_RUSSIA },
      fakeContext(ADMIN),
    );
    expect(result).toHaveGraphqlError(
      ApolloErrorCodes.UNKNOWN_ERROR,
      'Autofill failed: boom!',
    );
  });
});

describe('source without gauges', () => {
  let result: ExecutionResult<TData> | null = null;

  beforeEach(async () => {
    result = null;
    result = await runQuery(
      mutation,
      { id: SOURCE_RUSSIA },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
  });

  it('should insert gauges', async () => {
    const [pAfter, gAfter, tAfter] = await countRows(
      false,
      'points',
      'gauges',
      'gauges_translations',
    );
    expect([gAfter - gBefore, pAfter - pBefore, tAfter - tBefore]).toEqual([
      2,
      2,
      2,
    ]);
  });

  it('should return gauges', async () => {
    expect(noUnstable(result!.data!.autofillSource)).toMatchSnapshot();
  });
});

describe('source with gauges', () => {
  let result: ExecutionResult<TData> | null = null;

  beforeEach(async () => {
    result = null;
    result = await runQuery(
      mutation,
      { id: SOURCE_GALICIA_1 },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
  });

  it('should update gauges', async () => {
    const gauge = await db(false)
      .select('*')
      .from('gauges_view')
      .where({ id: GAUGE_GAL_1_1, language: 'en' })
      .first();
    expect(gauge).toMatchObject({
      name: 'Galicia GAUGE 1',
      url: 'http://ww.guide/gal1',
      level_unit: 'm',
      flow_unit: null,
      location: {
        coordinates: { coordinates: [22, 11, 33], type: 'Point' },
      },
    });
  });

  it('should add new gauges', async () => {
    const [pAfter, gAfter, tAfter] = await countRows(
      false,
      'points',
      'gauges',
      'gauges_translations',
    );
    expect([gAfter - gBefore, pAfter - pBefore, tAfter - tBefore]).toEqual([
      1,
      1,
      1,
    ]);
  });

  it('should return gauges', async () => {
    expect(noUnstable(result!.data!.autofillSource)).toMatchSnapshot();
  });
});
