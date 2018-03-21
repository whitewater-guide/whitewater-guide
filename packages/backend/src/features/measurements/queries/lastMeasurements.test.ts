// tslint:disable-next-line:no-implicit-dependencies
import { holdTransaction, rollbackTransaction } from '../../../db';
import db from '../../../db/db';
import { GAUGE_GAL_1_1, GAUGE_GAL_2_1 } from '../../../seeds/test/05_gauges';
import { GALICIA_R1_S1 } from '../../../seeds/test/08_sections';
import { runQuery } from '../../../test/db-helpers';
import { TIMESTAMP_REGEX } from '../../../test/isTimestamp';
import { cteBuilder } from './lastMeasurements';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query lastMeasurements($gaugeId: ID, $sectionId: ID, $days: Int!){
    lastMeasurements(gaugeId: $gaugeId, sectionId: $sectionId, days: $days) {
      timestamp
      level
      flow
    }
  }
`;

it('should build correct query for gauge', () => {
  const builderBuilder = cteBuilder(GAUGE_GAL_1_1);
  const builder = builderBuilder(db(true).queryBuilder());
  expect(builder).toMatchSnapshot();
});

it('should build correct query for section', () => {
  const builderBuilder = cteBuilder(undefined, GALICIA_R1_S1);
  const builder = builderBuilder(db(true).queryBuilder());
  expect(builder).toMatchSnapshot();
});

it('should prefer gauge id to section id', () => {
  const builderBuilder = cteBuilder(GAUGE_GAL_1_1, GALICIA_R1_S1);
  const builder = builderBuilder(db(true).queryBuilder());
  expect(builder.toQuery()).not.toEqual(expect.stringContaining('section'));
});

it('should should fail when neither gaugeId not sectionId is provided', async () => {
  const r = await runQuery(query, { days: 1 });
  expect(r).toHaveProperty('errors.0.name', 'ValidationError');
  expect(r).toHaveProperty('errors.0.message', 'Either gauge id or section id must be specified');
  expect(r).toHaveProperty('data.lastMeasurements', null);
});

it('should should return empty array when nothing is found', async () => {
  const r = await runQuery(query, { gaugeId: GAUGE_GAL_2_1, days: 1 });
  expect(r.errors).toBeUndefined();
  expect(r.data!.lastMeasurements).toHaveLength(0);
});

it('should should clamp days', async () => {
  const r = await runQuery(query, { gaugeId: GAUGE_GAL_1_1, days: -1 });
  expect(r.errors).toBeUndefined();
  expect(r.data!.lastMeasurements.length).toBeGreaterThan(0);
});

it('should should limit by number of days', async () => {
  const r = await runQuery(query, { gaugeId: GAUGE_GAL_1_1, days: 1 });
  expect(r.errors).toBeUndefined();
  expect(r.data!.lastMeasurements).toHaveLength(3);
});

it('should should return result with newer measurements first (sort order)', async () => {
  const r = await runQuery(query, { gaugeId: GAUGE_GAL_1_1, days: 1 });
  const [m1, m2] = r.data!.lastMeasurements;
  expect(new Date(m1.timestamp).valueOf()).toBeGreaterThan(new Date(m2.timestamp).valueOf());
});

it('should return correct result shape', async () => {
  const r = await runQuery(query, { gaugeId: GAUGE_GAL_1_1, days: 1 });
  const [m1] = r.data!.lastMeasurements;
  expect(m1).toMatchObject({
    timestamp: expect.stringMatching(TIMESTAMP_REGEX),
    flow: null,
    level: 1.2,
  });
});
