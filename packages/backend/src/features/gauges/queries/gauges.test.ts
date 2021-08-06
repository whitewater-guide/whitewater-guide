import { anonContext, fakeContext, noTimestamps } from '@test';
import gql from 'graphql-tag';

import { db, holdTransaction, rollbackTransaction } from '~/db';
import { ADMIN, EDITOR_NO_EC, TEST_USER } from '~/seeds/test/01_users';
import { REGION_GALICIA } from '~/seeds/test/04_regions';
import { SOURCE_NORWAY } from '~/seeds/test/05_sources';
import { TOTAL_GAUGES } from '~/seeds/test/06_gauges';

import { testListGauges } from './gauges.test.generated';

jest.mock('../../gorge/connector.ts');

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const _query = gql`
  query listGauges($filter: GaugesFilter, $page: Page) {
    gauges(filter: $filter, page: $page) {
      nodes {
        ...GaugeCore
        ...GaugeLocation
        ...GaugeHarvestInfo
        ...GaugeStatus
        ...GaugeLatestMeasurement
        ...TimestampedMeta
        source {
          id
        }
        enabled
      }
      count
    }
  }
`;

describe('resolvers chain', () => {
  it('anon should not see request params', async () => {
    const result = await testListGauges(undefined, anonContext());
    expect(result.errors).toBeUndefined();
    expect(result.data?.gauges.nodes[0]).toMatchObject({
      requestParams: null,
    });
  });

  it('user should not see request params', async () => {
    const result = await testListGauges(undefined, fakeContext(TEST_USER));
    expect(result.errors).toBeUndefined();
    expect(result.data?.gauges.nodes[0]).toMatchObject({
      requestParams: null,
    });
  });

  it('editor should not see request params', async () => {
    const result = await testListGauges(undefined, fakeContext(EDITOR_NO_EC));
    expect(result.errors).toBeUndefined();
    expect(result.data?.gauges.nodes[0]).toMatchObject({
      requestParams: null,
    });
  });
});

it('should return gauges', async () => {
  const result = await testListGauges(undefined, fakeContext(ADMIN));
  expect(result.errors).toBeUndefined();
  expect(result.data).toBeDefined();
  expect(result.data?.gauges).toBeDefined();
  expect(result.data?.gauges.count).toBe(TOTAL_GAUGES);
  expect(result.data?.gauges.nodes.map(noTimestamps)).toMatchSnapshot();
});

it('should be able to specify language', async () => {
  const result = await testListGauges({}, fakeContext(ADMIN, 'ru'));
  expect(result.errors).toBeUndefined();
  expect(result.data?.gauges.count).toBe(TOTAL_GAUGES);
  const names = result.data?.gauges.nodes.map((node: any) => node.name);
  expect(names).toEqual(expect.arrayContaining(['Галисийская линейка 1']));
});

it('should fall back to english', async () => {
  const result = await testListGauges({}, fakeContext(ADMIN, 'ru'));
  expect(result.errors).toBeUndefined();
  expect(result.data?.gauges.count).toBe(TOTAL_GAUGES);
  const names = result.data?.gauges.nodes.map((node: any) => node.name);
  expect(names).toEqual(expect.arrayContaining(['Georgian gauge 3']));
});

it('should be able to specify source id', async () => {
  const result = await testListGauges(
    { filter: { sourceId: SOURCE_NORWAY } },
    fakeContext(ADMIN),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data?.gauges.count).toBe(4);
  expect(result.data?.gauges.nodes[0].code).toBe('nor1');
});

it('should be able to specify region id', async () => {
  const result = await testListGauges(
    { filter: { regionId: REGION_GALICIA } },
    fakeContext(ADMIN),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data?.gauges.count).toBe(4);
  expect(result.data?.gauges.nodes).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        code: 'gal1',
      }),
      expect.objectContaining({
        code: 'gal2_1',
      }),
    ]),
  );
});

it('should be able to search', async () => {
  const result = await testListGauges(
    { filter: { search: 'Gauge 4' } },
    fakeContext(ADMIN),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data?.gauges.count).toBe(2);
  expect(result.data?.gauges.nodes).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        code: 'geo4',
      }),
      expect.objectContaining({
        code: 'nor4',
      }),
    ]),
  );
});

it('should paginate', async () => {
  const result = await testListGauges(
    { filter: { sourceId: SOURCE_NORWAY }, page: { limit: 1, offset: 1 } },
    fakeContext(ADMIN),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data?.gauges.count).toBe(4);
  expect(result.data?.gauges.nodes).toHaveLength(1);
  expect(result.data?.gauges.nodes[0].code).toBe('nor2');
});

it('should fire two queries', async () => {
  const queryMock = jest.fn();
  db().on('query', queryMock);
  await testListGauges(
    { filter: { sourceId: SOURCE_NORWAY } },
    fakeContext(ADMIN),
  );
  db().removeListener('query', queryMock);
  expect(queryMock).toHaveBeenCalledTimes(2);
});
