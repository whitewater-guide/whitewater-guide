import { UnknownError } from '../../../apollo';
import db, { holdTransaction, rollbackTransaction } from '../../../db';
import { SOURCE_ALPS, SOURCE_GALICIA_1, SOURCE_RUSSIA } from '../../../seeds/test/04_sources';
import { anonContext, superAdminContext, userContext } from '../../../test/context';
import { noUnstable, runQuery } from '../../../test/db-helpers';
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
      language
      code
      location {
        id
        language
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
        language
      }
    }
  }
`;

let pointsBefore: number;
let gaugesBefore: number;
let translationsBefore: number;

beforeAll(async () => {
  const pCnt = await db(true).table('points').count().first();
  const gCnt = await db(true).table('gauges').count().first();
  const tCnt = await db(true).table('gauges_translations').count().first();
  pointsBefore = Number(pCnt.count);
  gaugesBefore = Number(gCnt.count);
  translationsBefore = Number(tCnt.count);
});

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await runQuery(query, { id: SOURCE_GALICIA_1 }, anonContext);
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.autofillSource).toBeNull();
  });

  it('user should not pass', async () => {
    const result = await runQuery(query, { id: SOURCE_GALICIA_1 }, userContext);
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.autofillSource).toBeNull();
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
    const result = await runQuery(query, { id: SOURCE_ALPS }, superAdminContext);
    expect(result.data!.autofillSource).toBeNull();
    expect(result).toHaveProperty('errors.0.name', 'MutationNotAllowedError');
    expect(result).toHaveProperty('errors.0.message', 'Cannot autofill source that is enabled');
  });

  it('should fail for source with gauges', async () => {
    const result = await runQuery(query, { id: SOURCE_GALICIA_1 }, superAdminContext);
    expect(result.data!.autofillSource).toBeNull();
    expect(result).toHaveProperty('errors.0.name', 'MutationNotAllowedError');
    expect(result).toHaveProperty('errors.0.message', 'Cannot autofill source that already has gauges');
  });

  it('should fail when script fails', async () => {
    const scriptsError: ScriptResponse<ScriptGaugeInfo> = {
      success: false,
      error: 'boom!',
    };
    (execScript as Mock<any>).mockReturnValueOnce(Promise.resolve(scriptsError));
    const result = await runQuery(query, { id: SOURCE_RUSSIA }, superAdminContext);
    expect(result.data!.autofillSource).toBeNull();
    expect(result).toHaveProperty('errors.0.name', 'UnknownError');
    expect(result).toHaveProperty('errors.0.message', 'Autofill failed: boom!');
  });

  it('should insert gauges', async () => {
    (execScript as Mock<any>).mockReturnValueOnce(Promise.resolve(scriptSuccess));
    const result = await runQuery(query, { id: SOURCE_RUSSIA }, superAdminContext);
    expect(result.data!.autofillSource).toBeDefined();
    const { count: pCnt } = await db().table('points').count().first();
    const { count: gCnt } = await db().table('gauges').count().first();
    const { count: tCnt } = await db().table('gauges_translations').count().first();
    expect(Number(gCnt) - gaugesBefore).toBe(2);
    expect(Number(pCnt) - pointsBefore).toBe(2);
    expect(Number(tCnt) - translationsBefore).toBe(2);
  });

  it('should return gauges', async () => {
    (execScript as Mock<any>).mockReturnValueOnce(Promise.resolve(scriptSuccess));
    const result = await runQuery(query, { id: SOURCE_RUSSIA }, superAdminContext);
    expect(noUnstable(result)).toMatchSnapshot();
  });
});
