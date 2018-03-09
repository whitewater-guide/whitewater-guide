import db, { holdTransaction, rollbackTransaction } from '../../../db';
import { SOURCE_GALICIA_1, SOURCE_NORWAY } from '../../../seeds/test/04_sources';
import { GAUGE_GAL_1_1, GAUGE_GEO_3 } from '../../../seeds/test/05_gauges';
import { adminContext, anonContext, userContext } from '../../../test/context';
import { isTimestamp, isUUID, noUnstable, runQuery } from '../../../test/db-helpers';
import { GaugeInput } from '../../../ww-commons';
import { GaugeRaw } from '../types';

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

const upsertQuery = `
  mutation upsertGauge($gauge: GaugeInput!, $language: String){
    upsertGauge(gauge: $gauge, language: $language){
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

describe('resolvers chain', () => {
  const gauge: GaugeInput = {
    id: null,
    source: { id: SOURCE_NORWAY },
    name: 'norway gauge 5',
    code: 'nor5',
    location: null,
    levelUnit: 'cm',
    flowUnit: null,
    requestParams: null,
    cron: null,
    url: null,
  };

  test('anon should not pass', async () => {
    const result = await runQuery(upsertQuery, { gauge }, anonContext);
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.upsertGauge', null);
  });

  test('user should not pass', async () => {
    const result = await runQuery(upsertQuery, { gauge }, userContext);
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.upsertGauge', null);
  });

  test('should throw on invalid input', async () => {
    const invalidInput: GaugeInput = {
      id: 'wtf',
      source: { id: 'lol' },
      name: 'x',
      code: 'y',
      location: { id: 'z', name: 'o', description: null, coordinates: [1000, 1, 1], kind: 'rrr' },
      levelUnit: '',
      flowUnit: '',
      requestParams: null,
      cron: 'aaa',
      url: 'bbb',
    };
    const result = await runQuery(upsertQuery, { gauge: invalidInput }, adminContext);
    expect(result).toHaveProperty('errors.0.name', 'ValidationError');
    expect(result.data).toBeDefined();
    expect(result.data!.upsertGauge).toBeNull();
    expect((result.errors![0] as any).data).toMatchSnapshot();
  });
});

describe('insert', () => {
  const input: GaugeInput = {
    id: null,
    source: { id: SOURCE_NORWAY },
    name: 'norway gauge 5',
    code: 'nor5',
    location: { id: null, name: null, description: null, coordinates: [11.1, 12.2, 1.1], kind: 'gauge' },
    levelUnit: 'cm',
    flowUnit: 'm3/s',
    requestParams: { foo: 'bar' },
    cron: '10 * * * *',
    url: 'http://nve.no/nor5',
  };

  it('should return result', async () => {
    const result = await runQuery(upsertQuery, { gauge: input }, adminContext);
    const gauge = result && result.data && result.data.upsertGauge;
    expect(result.errors).toBeUndefined();
    expect(isUUID(gauge.id)).toBe(true);
    expect(isTimestamp(gauge.createdAt)).toBe(true);
    expect(isTimestamp(gauge.updatedAt)).toBe(true);
    expect(gauge).toHaveProperty('source');
    expect(gauge).toHaveProperty('location');
  });

  it('should add one more gauge', async () => {
    await runQuery(upsertQuery, { gauge: input }, adminContext);
    const { count } = await db().table('gauges').count().first();
    expect(Number(count) - gaugesBefore).toBe(1);
  });

  it('should insert point', async () => {
    await runQuery(upsertQuery, { gauge: input }, adminContext);
    const points = await db().table('points').count().first();
    expect(Number(points.count) - pointsBefore).toBe(1);
  });

  it('should handle null point', async () => {
    const result = await runQuery(upsertQuery, { gauge: { ...input, location: null } }, adminContext);
    const gauge = result && result.data && result.data.upsertGauge;
    expect(gauge.location).toBeNull();
  });

  it('should handle null requestParams', async () => {
    const result = await runQuery(upsertQuery, { gauge: { ...input, requestParams: null } }, adminContext);
    const gauge = result && result.data && result.data.upsertGauge;
    expect(gauge.requestParams).toBeNull();
  });

  test('should match snapshot', async () => {
    const result = await runQuery(upsertQuery, { gauge: input }, adminContext);
    expect(noUnstable(result)).toMatchSnapshot();
  });
});

describe('update', () => {
  const input: GaugeInput = {
    id: GAUGE_GAL_1_1,
    source: { id: SOURCE_GALICIA_1 },
    name: 'GALICIA GAUGE 1',
    code: 'gal1',
    location: {
      id: '0c86ff2c-bbdd-11e7-abc4-cec278b6b50a',
      name: null,
      description: null,
      coordinates: [11.1, 12.2, 1.1],
      kind: 'gauge',
    },
    levelUnit: 'm',
    flowUnit: 'cm3/s',
    requestParams: { lol: 'fun' },
    cron: '10 * * * *',
    url: 'http://galic.ia/gal1',
  };

  let oldGauge: GaugeRaw | null;
  let updateResult: any;
  let updatedGauge: any;

  beforeEach(async () => {
    oldGauge = await db().table('gauges').where({ id: input.id }).first();
    updateResult = await runQuery(upsertQuery, { gauge: input }, adminContext);
    updatedGauge = updateResult && updateResult.data && updateResult.data.upsertGauge;
  });

  afterEach(() => {
    updateResult = null;
    updatedGauge = null;
    oldGauge = null;
  });

  it('should return result', async () => {
    expect(updateResult.errors).toBeUndefined();
    expect(updateResult.data).toBeDefined();
    expect(updatedGauge).toBeDefined();
    expect(updatedGauge.id).toBe(input.id);
  });

  it('should not change total number of gauges', async () => {
    const { count } = await db().table('gauges').count().first();
    expect(Number(count)).toBe(gaugesBefore);
  });

  it('should update updated_at timestamp', async () => {
    expect(updatedGauge.createdAt).toBe(oldGauge!.created_at.toISOString());
    expect(new Date(updatedGauge.updatedAt).valueOf()).toBeGreaterThan(oldGauge!.updated_at.valueOf());
  });

  it('should update location', async () => {
    expect(updatedGauge.location).toMatchObject({
      id: '0c86ff2c-bbdd-11e7-abc4-cec278b6b50a',
      coordinates: [11.1, 12.2, 1.1],
      kind: 'gauge',
    });
  });

  test('should not change enabled gauges', async () => {
    const result = await runQuery(upsertQuery, { gauge: { ...input, id: GAUGE_GEO_3 } }, adminContext);
    expect(result.errors).toBeDefined();
    expect(result.data!.upsertGauge).toBeNull();
    expect(result).toHaveProperty('errors.0.name', 'MutationNotAllowedError');
    expect(result).toHaveProperty('errors.0.message', 'Disable gauge before editing it');
  });

  it('should match snapshot', async () => {
    expect(noUnstable(updateResult)).toMatchSnapshot();
  });
});

describe('i18n', () => {
  const inputPt: GaugeInput = {
    id: 'aba8c106-aaa0-11e7-abc4-cec278b6b50a', // gal1
    source: { id: '6d0d717e-aa9d-11e7-abc4-cec278b6b50a' },
    name: 'galicia gauge pt',
    code: 'gal1',
    location: {
      id: '0c86ff2c-bbdd-11e7-abc4-cec278b6b50a',
      name: null,
      description: null,
      coordinates: [11.1, 12.2, 1.1],
      kind: 'gauge',
    },
    levelUnit: 'm',
    flowUnit: 'cm3/s',
    requestParams: { lol: 'fun' },
    cron: '10 * * * *',
    url: 'http://galic.ia/gal1',
  };

  it('should add new translation', async () => {
    await runQuery(upsertQuery, { gauge: inputPt, language: 'pt' }, adminContext);
    const { count } = await db().table('gauges_translations').count().first();
    expect(Number(count) - translationsBefore).toBe(1);
    const name = await db().table('gauges_view').select('name')
      .where({ language: 'pt', id: GAUGE_GAL_1_1 }).first();
    expect(name.name).toBe('galicia gauge pt');
  });

  it('should modify common props in other language', async () => {
    await runQuery(upsertQuery, { gauge: inputPt, language: 'pt' }, adminContext);
    const flowUnit = await db().table('gauges_view').select('flow_unit')
      .where({ language: 'en', id: 'aba8c106-aaa0-11e7-abc4-cec278b6b50a' }).first();
    expect(flowUnit.flow_unit).toBe('cm3/s');
  });

  it('should modify existing translation', async () => {
    await runQuery(upsertQuery, { gauge: inputPt, language: 'en' }, adminContext);
    const { count } = await db().table('gauges_translations').count().first();
    expect(Number(count)).toBe(translationsBefore);
    const name = await db().table('gauges_view').select('name')
      .where({ language: 'en', id: GAUGE_GAL_1_1 }).first();
    expect(name.name).toBe('galicia gauge pt');
  });
});
