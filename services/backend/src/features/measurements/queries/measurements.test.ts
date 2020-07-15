import { holdTransaction, rollbackTransaction } from '~/db';
import { GAUGE_GAL_1_1, GAUGE_GAL_2_1 } from '~/seeds/test/06_gauges';
import { runQuery, TIMESTAMP_REGEX } from '~/test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import { GALICIA_R1_S1 } from '../../../seeds/test/09_sections';

jest.mock('../../gorge/connector');

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query measurements($gaugeId: ID, $sectionId: ID, $days: Int, $filter: MeasurementsFilter){
    measurements(gaugeId: $gaugeId, sectionId: $sectionId, days: $days, filter: $filter) {
      timestamp
      level
      flow
    }
  }
`;

it('should should fail when neither gaugeId not sectionId is provided', async () => {
  const r = await runQuery(query, { days: 1 });
  expect(r).toHaveGraphqlError(
    ApolloErrorCodes.BAD_USER_INPUT,
    'Either gauge id or section id must be specified',
  );
});

it('should should return empty array when nothing is found', async () => {
  const r = await runQuery(query, { gaugeId: GAUGE_GAL_2_1, days: 1 });
  expect(r.errors).toBeUndefined();
  expect(r.data!.measurements).toHaveLength(0);
});

it('should should limit by number of days', async () => {
  let r = await runQuery(query, { gaugeId: GAUGE_GAL_1_1, days: 1 });
  expect(r.errors).toBeUndefined();
  expect(r.data!.measurements).toHaveLength(4);
  r = await runQuery(query, { gaugeId: GAUGE_GAL_1_1, days: 2 });
  expect(r.data!.measurements).toHaveLength(5);
});

it('should should limit by range', async () => {
  const r = await runQuery(query, {
    gaugeId: GAUGE_GAL_1_1,
    filter: {
      from: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
      to: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    },
  });
  expect(r.errors).toBeUndefined();
  expect(r.data!.measurements).toHaveLength(1);
});

it('should query by section', async () => {
  const r = await runQuery(query, { sectionId: GALICIA_R1_S1, days: 1 });
  expect(r.errors).toBeUndefined();
  expect(r.data!.measurements).toHaveLength(4);
  expect(r.data!.measurements[0]).toMatchObject({
    flow: null,
    level: 1.2,
    timestamp: expect.stringMatching(TIMESTAMP_REGEX),
  });
});

it('should return correct result shape', async () => {
  const r = await runQuery(query, { gaugeId: GAUGE_GAL_1_1, days: 1 });
  const [m1] = r.data!.measurements;
  expect(m1).toMatchObject({
    timestamp: expect.stringMatching(TIMESTAMP_REGEX),
    flow: null,
    level: 1.2,
  });
});

it('should handle deprecated query', async () => {
  const q = `
  query lastMeasurements($gaugeId: ID, $sectionId: ID, $days: Int!){
    lastMeasurements(gaugeId: $gaugeId, sectionId: $sectionId, days: $days) {
      timestamp
      level
      flow
    }
  }
`;
  const r = await runQuery(q, { gaugeId: GAUGE_GAL_1_1, days: 1 });
  const [m1] = r.data!.lastMeasurements;
  expect(m1).toMatchObject({
    timestamp: expect.stringMatching(TIMESTAMP_REGEX),
    flow: null,
    level: 1.2,
  });
});

it('should handle query with deprecated non-nullable days and without filter', async () => {
  const q = `
    query measurements($gaugeId: ID, $sectionId: ID, $days: Int!){
      measurements(gaugeId: $gaugeId, sectionId: $sectionId, days: $days) {
        timestamp
        level
        flow
      }
    }
  `;
  const r = await runQuery(q, { gaugeId: GAUGE_GAL_1_1, days: 1 });
  expect(r.errors).toBeUndefined();
  expect(r.data!.measurements).toHaveLength(4);
});
