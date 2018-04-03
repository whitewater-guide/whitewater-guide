import { holdTransaction, rollbackTransaction } from '../../../db';
import { EDITOR_GA_EC, EDITOR_NO_EC } from '../../../seeds/test/01_users';
import { SOURCE_NORWAY } from '../../../seeds/test/04_sources';
import { GAUGE_GAL_1_1, GAUGE_NOR_1, GAUGE_NOR_2, GAUGE_NOR_4 } from '../../../seeds/test/05_gauges';
import { anonContext, fakeContext } from '../../../test/context';
import { runQuery } from '../../../test/db-helpers';
import { startJobs, stopJobs } from '../../jobs';

jest.mock('../../jobs', () => ({
  startJobs: jest.fn(),
  stopJobs: jest.fn(),
}));

const query = `
  mutation toggleGauge($id: ID!, $enabled: Boolean!){
    toggleGauge(id: $id, enabled: $enabled) {
      id
      enabled
    }
  }
`;

const gal1 = { id: GAUGE_GAL_1_1, enabled: true };
const nor1 = { id: GAUGE_NOR_1, enabled: false };

beforeEach(async () => {
  jest.clearAllMocks();
  await holdTransaction();
});
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  test('anon should not pass', async () => {
    const result = await runQuery(query, gal1, anonContext());
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.toggleGauge).toBeNull();
  });

  test('user should not pass', async () => {
    const result = await runQuery(query, gal1, fakeContext(EDITOR_NO_EC));
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.toggleGauge).toBeNull();
  });
});

describe('effects', () => {
  it('should not enable gauge if source is all-at-once', async () => {
    const result = await runQuery(query, gal1, fakeContext(EDITOR_GA_EC));
    expect(result.errors).toBeDefined();
    expect(result.data!.toggleGauge).toBeNull();
    expect(result).toHaveProperty('errors.0.name', 'MutationNotAllowedError');
    expect(result).toHaveProperty('errors.0.message', 'Cannot toggle gauge for all-at-once sources');
  });

  it('should not enable gauge without cron', async () => {
    const result = await runQuery(query, { id: GAUGE_NOR_2, enabled: true }, fakeContext(EDITOR_GA_EC));
    expect(result.errors).toBeDefined();
    expect(result.data!.toggleGauge).toBeNull();
    expect(result).toHaveProperty('errors.0.name', 'MutationNotAllowedError');
    expect(result).toHaveProperty('errors.0.message', 'Cron must be set to enable gauge');
  });

  it('should enable', async () => {
    const result = await runQuery(query, { id: GAUGE_NOR_4, enabled: true }, fakeContext(EDITOR_GA_EC));
    expect(result.errors).toBeUndefined();
    expect(result.data!.toggleGauge).toMatchObject({
      id: GAUGE_NOR_4,
      enabled: true,
    });
  });

  it('should start job', async () => {
    await runQuery(query, { id: GAUGE_NOR_4, enabled: true }, fakeContext(EDITOR_GA_EC));
    expect(startJobs).lastCalledWith(SOURCE_NORWAY, GAUGE_NOR_4);
  });

  it('should disable', async () => {
    const result = await runQuery(query, nor1, fakeContext(EDITOR_GA_EC));
    expect(result.errors).toBeUndefined();
    expect(result.data!.toggleGauge).toMatchObject({
      ...nor1,
    });
  });

  it('should stop job', async () => {
    await runQuery(query, { id: GAUGE_NOR_1, enabled: false }, fakeContext(EDITOR_GA_EC));
    expect(stopJobs).lastCalledWith(SOURCE_NORWAY, GAUGE_NOR_1);
  });

});
