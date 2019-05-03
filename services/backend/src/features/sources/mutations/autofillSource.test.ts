import db, { holdTransaction, rollbackTransaction } from '@db';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '@seeds/01_users';
import {
  SOURCE_ALPS,
  SOURCE_GALICIA_1,
  SOURCE_RUSSIA,
} from '@seeds/05_sources';
import { GAUGE_GAL_1_1 } from '@seeds/06_gauges';
import {
  anonContext,
  countRows,
  fakeContext,
  noUnstable,
  runQuery,
} from '@test';
import { ApolloErrorCodes, Gauge } from '@whitewater-guide/commons';
import { ExecutionResult } from 'graphql';
import { execScript, ScriptGaugeInfo, ScriptResponse } from '../../scripts';

interface TData {
  autofillSource: Gauge[];
}

jest.mock('../../scripts', () => ({
  execScript: jest.fn(),
}));

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
      cron
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
  it('should fail for enabled source', async () => {
    const result = await runQuery(
      mutation,
      { id: SOURCE_ALPS },
      fakeContext(ADMIN),
    );
    expect(result.data!.autofillSource).toBeNull();
    expect(result).toHaveGraphqlError(
      ApolloErrorCodes.MUTATION_NOT_ALLOWED,
      'Cannot autofill source that is enabled',
    );
  });

  it('should fail when script fails', async () => {
    const scriptsError: ScriptResponse<ScriptGaugeInfo> = {
      success: false,
      error: 'boom!',
    };
    (execScript as any).mockReturnValueOnce(Promise.resolve(scriptsError));
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

  const scriptSuccess: ScriptResponse<ScriptGaugeInfo[]> = {
    success: true,
    data: [
      {
        name: 'Russia gauge 1',
        location: { latitude: 11, longitude: 22, altitude: 33 },
        url: 'http://ww.guide/ru1',
        flowUnit: '',
        levelUnit: 'm',
        code: 'ru1',
        script: 'russia',
      },
      {
        name: 'Russia gauge 2',
        location: { latitude: 44, longitude: 55, altitude: 66 },
        url: 'http://ww.guide/ru2',
        flowUnit: 'm3/s',
        levelUnit: 'm',
        code: 'ru2',
        script: 'russia',
      },
    ],
  };

  beforeEach(async () => {
    (execScript as any).mockReturnValueOnce(Promise.resolve(scriptSuccess));
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

  const scriptSuccess: ScriptResponse<ScriptGaugeInfo[]> = {
    success: true,
    data: [
      {
        name: 'Galicia GAUGE 1',
        location: { latitude: 11, longitude: 22, altitude: 33 },
        url: 'http://ww.guide/gal1',
        flowUnit: '',
        levelUnit: 'm',
        code: 'gal1',
        script: 'galicia',
      },
      {
        name: 'Galicia gauge 3',
        location: { latitude: 33, longitude: 44, altitude: 55 },
        url: 'http://ww.guide/gal3',
        flowUnit: '',
        levelUnit: 'm',
        code: 'gal3',
        script: 'galicia',
      },
    ],
  };

  beforeEach(async () => {
    (execScript as any).mockReturnValueOnce(Promise.resolve(scriptSuccess));
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
