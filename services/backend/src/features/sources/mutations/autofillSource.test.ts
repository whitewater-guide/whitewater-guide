import { UnknownError } from '@apollo';
import { holdTransaction, rollbackTransaction } from '@db';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '@seeds/01_users';
import {
  SOURCE_ALPS,
  SOURCE_GALICIA_1,
  SOURCE_RUSSIA,
} from '@seeds/05_sources';
import {
  anonContext,
  countRows,
  fakeContext,
  noUnstable,
  runQuery,
} from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import { execScript, ScriptGaugeInfo, ScriptResponse } from '../../scripts';
import Mock = jest.Mock;

jest.mock('../../scripts', () => ({
  execScript: jest.fn(),
}));

const query = `
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
      query,
      { id: SOURCE_GALICIA_1 },
      anonContext(),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should not pass', async () => {
    const result = await runQuery(
      query,
      { id: SOURCE_GALICIA_1 },
      fakeContext(TEST_USER),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editor should not pass', async () => {
    const result = await runQuery(
      query,
      { id: SOURCE_GALICIA_1 },
      fakeContext(EDITOR_GA_EC),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });
});

describe('effects', () => {
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

  it('should fail for enabled source', async () => {
    const result = await runQuery(
      query,
      { id: SOURCE_ALPS },
      fakeContext(ADMIN),
    );
    expect(result.data!.autofillSource).toBeNull();
    expect(result).toHaveGraphqlError(
      ApolloErrorCodes.MUTATION_NOT_ALLOWED,
      'Cannot autofill source that is enabled',
    );
  });

  it('should fail for source with gauges', async () => {
    const result = await runQuery(
      query,
      { id: SOURCE_GALICIA_1 },
      fakeContext(ADMIN),
    );
    expect(result).toHaveGraphqlError(
      ApolloErrorCodes.MUTATION_NOT_ALLOWED,
      'Cannot autofill source that already has gauges',
    );
  });

  it('should fail when script fails', async () => {
    const scriptsError: ScriptResponse<ScriptGaugeInfo> = {
      success: false,
      error: 'boom!',
    };
    (execScript as Mock<any>).mockReturnValueOnce(
      Promise.resolve(scriptsError),
    );
    const result = await runQuery(
      query,
      { id: SOURCE_RUSSIA },
      fakeContext(ADMIN),
    );
    expect(result).toHaveGraphqlError(
      ApolloErrorCodes.UNKNOWN_ERROR,
      'Autofill failed: boom!',
    );
  });

  it('should insert gauges', async () => {
    (execScript as Mock<any>).mockReturnValueOnce(
      Promise.resolve(scriptSuccess),
    );
    const result = await runQuery(
      query,
      { id: SOURCE_RUSSIA },
      fakeContext(ADMIN),
    );
    expect(result.data!.autofillSource).toBeDefined();
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
    (execScript as Mock<any>).mockReturnValueOnce(
      Promise.resolve(scriptSuccess),
    );
    const result = await runQuery(
      query,
      { id: SOURCE_RUSSIA },
      fakeContext(ADMIN),
    );
    expect(noUnstable(result.data!.autofillSource)).toMatchSnapshot();
  });
});
