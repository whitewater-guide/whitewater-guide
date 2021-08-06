import {
  anonContext,
  countRows,
  fakeContext,
  isTimestamp,
  isUUID,
  noUnstable,
} from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import { GaugeInput } from '@whitewater-guide/schema';
import gql from 'graphql-tag';

import { db, holdTransaction, rollbackTransaction, Sql } from '~/db';
import { GorgeConnector } from '~/features/gorge';
import { ADMIN, EDITOR_NO_EC, TEST_USER } from '~/seeds/test/01_users';
import { SOURCE_GALICIA_1, SOURCE_NORWAY } from '~/seeds/test/05_sources';
import { GAUGE_GAL_1_1, GAUGE_GAL_2_1 } from '~/seeds/test/06_gauges';

import { testUpsertGauge } from './upsertGauge.test.generated';

jest.mock('../../gorge/connector');

let pBefore: number;
let gBefore: number;
let tBefore: number;

beforeAll(async () => {
  jest.resetAllMocks();
  [gBefore, tBefore, pBefore] = await countRows(
    true,
    'gauges',
    'gauges_translations',
    'points',
  );
});

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const _mutation = gql`
  mutation upsertGauge($gauge: GaugeInput!) {
    upsertGauge(gauge: $gauge) {
      ...GaugeCore
      ...GaugeLocation
      ...GaugeHarvestInfo
      ...GaugeStatus
      ...GaugeSource
      ...TimestampedMeta
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
    url: null,
  };

  it('anon should not pass', async () => {
    const result = await testUpsertGauge({ gauge }, anonContext());
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should not pass', async () => {
    const result = await testUpsertGauge({ gauge }, fakeContext(TEST_USER));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editor should not pass', async () => {
    const result = await testUpsertGauge({ gauge }, fakeContext(EDITOR_NO_EC));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('should throw on invalid input', async () => {
    const invalidInput: GaugeInput = {
      id: 'wtf',
      source: { id: 'lol' },
      name: 'x',
      code: 'y',
      location: {
        id: 'z',
        name: 'o',
        description: null,
        coordinates: [1000, 1, 1],
        kind: 'rrr',
      },
      levelUnit: '',
      flowUnit: '',
      requestParams: null,
      url: 'bbb',
    };
    const result = await testUpsertGauge(
      { gauge: invalidInput },
      fakeContext(ADMIN),
    );
    expect(result).toHaveGraphqlValidationError();
  });
});

describe('insert', () => {
  const input: GaugeInput = {
    id: null,
    source: { id: SOURCE_NORWAY },
    name: 'norway gauge 5',
    code: 'nor5',
    location: {
      id: null,
      name: null,
      description: null,
      coordinates: [11.1, 12.2, 1.1],
      kind: 'gauge',
    },
    levelUnit: 'cm',
    flowUnit: 'm3/s',
    requestParams: { foo: 'bar' },
    url: 'http://nve.no/nor5',
  };

  it('should return result', async () => {
    const result = await testUpsertGauge({ gauge: input }, fakeContext(ADMIN));
    const gauge = result?.data?.upsertGauge;
    expect(result.errors).toBeUndefined();
    expect(isUUID(gauge?.id)).toBe(true);
    expect(isTimestamp(gauge?.createdAt)).toBe(true);
    expect(isTimestamp(gauge?.updatedAt)).toBe(true);
    expect(gauge).toHaveProperty('source');
    expect(gauge).toHaveProperty('location');
  });

  it('should add one more gauge', async () => {
    await testUpsertGauge({ gauge: input }, fakeContext(ADMIN));
    const { count } = await db().table('gauges').count().first();
    expect(Number(count) - gBefore).toBe(1);
  });

  it('should insert point', async () => {
    await testUpsertGauge({ gauge: input }, fakeContext(ADMIN));
    const points = await db().table('points').count().first();
    expect(Number(points.count) - pBefore).toBe(1);
  });

  it('should handle null point', async () => {
    const result = await testUpsertGauge(
      { gauge: { ...input, location: null } },
      fakeContext(ADMIN),
    );
    const gauge = result?.data?.upsertGauge;
    expect(gauge?.location).toBeNull();
  });

  it('should handle null requestParams', async () => {
    const result = await testUpsertGauge(
      { gauge: { ...input, requestParams: null } },
      fakeContext(ADMIN),
    );
    const gauge = result?.data?.upsertGauge;
    expect(gauge?.requestParams).toBeNull();
  });

  it('should match snapshot', async () => {
    const result = await testUpsertGauge({ gauge: input }, fakeContext(ADMIN));
    expect(noUnstable(result.data?.upsertGauge)).toMatchSnapshot();
  });

  it('should sanitize input', async () => {
    const dirtyInput = { ...input, name: "it's a \\ $1 slash with . ?" };
    const result = await testUpsertGauge(
      { gauge: dirtyInput },
      fakeContext(ADMIN),
    );
    expect(result).toHaveProperty(
      'data.upsertGauge.name',
      "it's a \\ $1 slash with . ?",
    );
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
    url: 'http://galic.ia/gal1',
  };

  let oldGauge: Sql.GaugesView | null;
  let updateResult: any;
  let updatedGauge: any;

  beforeEach(async () => {
    oldGauge = await db().table('gauges').where({ id: input.id }).first();
    updateResult = await testUpsertGauge({ gauge: input }, fakeContext(ADMIN));
    updatedGauge = updateResult?.data?.upsertGauge;
  });

  afterEach(() => {
    updateResult = null;
    updatedGauge = null;
    oldGauge = null;
  });

  it('should return result', () => {
    expect(updateResult.errors).toBeUndefined();
    expect(updateResult.data).toBeDefined();
    expect(updatedGauge).toBeDefined();
    expect(updatedGauge.id).toBe(input.id);
  });

  it('should not change total number of gauges', async () => {
    const { count } = await db().table('gauges').count().first();
    expect(Number(count)).toBe(gBefore);
  });

  it('should update updated_at timestamp', async () => {
    const { created_at, updated_at } = await db()
      .table('gauges')
      .where({ id: input.id })
      .first();
    expect(created_at).toEqual(oldGauge!.created_at);
    expect(updated_at > oldGauge!.updated_at).toBe(true);
  });

  it('should update location', () => {
    expect(updatedGauge.location).toMatchObject({
      id: '0c86ff2c-bbdd-11e7-abc4-cec278b6b50a',
      coordinates: [11.1, 12.2, 1.1],
      kind: 'gauge',
    });
  });

  it('should match snapshot', () => {
    expect(noUnstable(updatedGauge)).toMatchSnapshot();
  });
});

describe('jobs', () => {
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
    url: 'http://galic.ia/gal1',
  };

  it('should call update job for enabled gauges', async () => {
    const spy = jest.spyOn(GorgeConnector.prototype, 'updateJobForSource');
    await testUpsertGauge({ gauge: input }, fakeContext(ADMIN));
    expect(spy).toHaveBeenCalledWith(SOURCE_GALICIA_1);
    spy.mockReset();
  });

  it('should not call update job for disabled gauges', async () => {
    const spy = jest.spyOn(GorgeConnector.prototype, 'updateJobForSource');
    await testUpsertGauge(
      { gauge: { ...input, id: GAUGE_GAL_2_1 } },
      fakeContext(ADMIN),
    );
    expect(spy).not.toHaveBeenCalled();
    spy.mockReset();
  });
});

describe('i18n', () => {
  const inputPt: GaugeInput = {
    id: GAUGE_GAL_1_1,
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
    url: 'http://galic.ia/gal1',
  };

  it('should add new translation', async () => {
    await testUpsertGauge({ gauge: inputPt }, fakeContext(ADMIN, 'pt'));
    const { count } = await db().table('gauges_translations').count().first();
    expect(Number(count) - tBefore).toBe(1);
    const name = await db()
      .table('gauges_view')
      .select('name')
      .where({ language: 'pt', id: GAUGE_GAL_1_1 })
      .first();
    expect(name.name).toBe('galicia gauge pt');
  });

  it('should modify common props in other language', async () => {
    await testUpsertGauge({ gauge: inputPt }, fakeContext(ADMIN, 'pt'));
    const flowUnit = await db()
      .table('gauges_view')
      .select('flow_unit')
      .where({ language: 'en', id: GAUGE_GAL_1_1 })
      .first();
    expect(flowUnit.flow_unit).toBe('cm3/s');
  });

  it('should modify existing translation', async () => {
    await testUpsertGauge({ gauge: inputPt }, fakeContext(ADMIN, 'en'));
    const { count } = await db().table('gauges_translations').count().first();
    expect(Number(count)).toBe(tBefore);
    const name = await db()
      .table('gauges_view')
      .select('name')
      .where({ language: 'en', id: GAUGE_GAL_1_1 })
      .first();
    expect(name.name).toBe('galicia gauge pt');
  });
});
