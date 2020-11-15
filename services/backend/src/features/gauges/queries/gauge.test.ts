import { holdTransaction, rollbackTransaction } from '~/db';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '~/seeds/test/01_users';
import { GAUGE_GAL_1_1, GAUGE_RU_1 } from '~/seeds/test/06_gauges';
import { anonContext, fakeContext, noTimestamps, runQuery } from '~/test';

jest.mock('../../gorge/connector.ts');

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query gaugeDetails($id: ID){
    gauge(id: $id) {
      id
      name
      code
      levelUnit
      flowUnit
      requestParams
      url
      enabled
      createdAt
      updatedAt
      source {
        id
        name
        enabled
        script
      }
      location {
        id
        coordinates
      }
    }
  }
`;

describe('resolvers chain', () => {
  it('anon should not see request params', async () => {
    const result = await runQuery(query, { id: GAUGE_GAL_1_1 }, anonContext());
    expect(result.errors).toBeUndefined();
    expect(result.data!.gauge).toMatchObject({
      requestParams: null,
    });
  });

  it('user should not see request params', async () => {
    const result = await runQuery(
      query,
      { id: GAUGE_GAL_1_1 },
      fakeContext(TEST_USER),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data!.gauge).toMatchObject({
      requestParams: null,
    });
  });

  it('editor should not see request params', async () => {
    const result = await runQuery(
      query,
      { id: GAUGE_GAL_1_1 },
      fakeContext(EDITOR_GA_EC),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data!.gauge).toMatchObject({
      requestParams: null,
    });
  });
});

it('should return gauge', async () => {
  const result = await runQuery(
    query,
    { id: GAUGE_GAL_1_1 },
    fakeContext(ADMIN),
  );
  expect(result.errors).toBeUndefined();
  expect(noTimestamps(result.data!.gauge)).toMatchSnapshot();
});

it('should return null when id not specified', async () => {
  const result = await runQuery(query, {}, fakeContext(ADMIN));
  expect(result.errors).toBeUndefined();
  expect(result.data!.gauge).toBeNull();
});

it('it should return latest measurement', async () => {
  const q = `
  query gaugeDetails($id: ID){
    gauge(id: $id) {
      id
      latestMeasurement {
        timestamp
        level
        flow
      }
    }
  }
`;
  const result = await runQuery(query, { id: GAUGE_GAL_1_1 });
  expect(result.errors).toBeUndefined();
  expect(result.data!.gauge.latestMeasurement).toMatchInlineSnapshot(
    `undefined`,
  );
});

describe('i18n', () => {
  it('should be able to specify language', async () => {
    const result = await runQuery(
      query,
      { id: GAUGE_GAL_1_1 },
      fakeContext(ADMIN, 'ru'),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data!.gauge.name).toBe('Галисийская линейка 1');
    expect(result.data!.gauge.url).toBe('http://ya.ru');
  });

  it('should fall back to english when translation is not provided', async () => {
    const result = await runQuery(
      query,
      { id: GAUGE_GAL_1_1 },
      fakeContext(ADMIN, 'fr'),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data!.gauge.name).toBe('Galicia gauge 1');
  });

  it('should fall back to default language when both desired and english translations are not provided', async () => {
    const result = await runQuery(
      query,
      { id: GAUGE_RU_1 },
      fakeContext(ADMIN, 'fr'),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data!.gauge.name).toBe('Российская линейка 1');
  });
});
