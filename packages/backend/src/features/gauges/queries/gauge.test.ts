import { gql } from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '../../../db/index';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '../../../seeds/test/01_users';
import { GAUGE_GAL_1_1, GAUGE_RU_1 } from '../../../seeds/test/06_gauges';
import { anonContext, fakeContext, noTimestamps } from '../../../test/index';
import {
  testGaugeDetails,
  testGaugeMeasurements,
} from './gauge.test.generated';

jest.mock('../../gorge/connector.ts');

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const _query = gql`
  query gaugeDetails($id: ID) {
    gauge(id: $id) {
      ...GaugeCore
      ...GaugeLocation
      ...GaugeHarvestInfo
      ...GaugeSource
      ...GaugeStatus
      ...TimestampedMeta
    }
  }
`;

describe('resolvers chain', () => {
  it('anon should not see request params', async () => {
    const result = await testGaugeDetails({ id: GAUGE_GAL_1_1 }, anonContext());
    expect(result.errors).toBeUndefined();
    expect(result.data?.gauge).toMatchObject({
      requestParams: null,
    });
  });

  it('user should not see request params', async () => {
    const result = await testGaugeDetails(
      { id: GAUGE_GAL_1_1 },
      fakeContext(TEST_USER),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.gauge).toMatchObject({
      requestParams: null,
    });
  });

  it('editor should not see request params', async () => {
    const result = await testGaugeDetails(
      { id: GAUGE_GAL_1_1 },
      fakeContext(EDITOR_GA_EC),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.gauge).toMatchObject({
      requestParams: null,
    });
  });
});

it('should return gauge', async () => {
  const result = await testGaugeDetails(
    { id: GAUGE_GAL_1_1 },
    fakeContext(ADMIN),
  );
  expect(result.errors).toBeUndefined();
  expect(noTimestamps(result.data?.gauge)).toMatchSnapshot();
});

it('should return null when id not specified', async () => {
  const result = await testGaugeDetails({}, fakeContext(ADMIN));
  expect(result.errors).toBeUndefined();
  expect(result.data?.gauge).toBeNull();
});

describe('i18n', () => {
  it('should be able to specify language', async () => {
    const result = await testGaugeDetails(
      { id: GAUGE_GAL_1_1 },
      fakeContext(ADMIN, 'ru'),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.gauge?.name).toBe('Галисийская линейка 1');
    expect(result.data?.gauge?.url).toBe('http://ya.ru');
  });

  it('should fall back to english when translation is not provided', async () => {
    const result = await testGaugeDetails(
      { id: GAUGE_GAL_1_1 },
      fakeContext(ADMIN, 'fr'),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.gauge?.name).toBe('Galicia gauge 1');
  });

  it('should fall back to default language when both desired and english translations are not provided', async () => {
    const result = await testGaugeDetails(
      { id: GAUGE_RU_1 },
      fakeContext(ADMIN, 'fr'),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data?.gauge?.name).toBe('Российская линейка 1');
  });
});

it('should return latest measurement', async () => {
  const _q = gql`
    query gaugeMeasurements($id: ID) {
      gauge(id: $id) {
        id
        ...GaugeLatestMeasurement
      }
    }
  `;
  const result = await testGaugeMeasurements({ id: GAUGE_GAL_1_1 });
  expect(result.errors).toBeUndefined();
  expect(result.data?.gauge?.latestMeasurement).toEqual({
    flow: null,
    level: 1.2,
    timestamp: expect.any(Date),
  });
});
