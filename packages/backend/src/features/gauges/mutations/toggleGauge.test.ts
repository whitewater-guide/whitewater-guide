import { holdTransaction, rollbackTransaction } from '../../../db';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '../../../seeds/test/01_users';
import { SOURCE_NORWAY } from '../../../seeds/test/05_sources';
import { GAUGE_GAL_1_1, GAUGE_NOR_1, GAUGE_NOR_2, GAUGE_NOR_4 } from '../../../seeds/test/06_gauges';
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
  it('anon should not pass', async () => {
    const result = await runQuery(query, gal1, anonContext());
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result.data!.toggleGauge).toBeNull();
  });

  it('user should not pass', async () => {
    const result = await runQuery(query, gal1, fakeContext(TEST_USER));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result.data!.toggleGauge).toBeNull();
  });

  it('user should not pass', async () => {
    const result = await runQuery(query, gal1, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result.data!.toggleGauge).toBeNull();
  });
});

describe('effects', () => {
  it('should not enable gauge if source is all-at-once', async () => {
    const result = await runQuery(query, gal1, fakeContext(ADMIN));
    expect(result.errors).toBeDefined();
    expect(result.data!.toggleGauge).toBeNull();
    expect(result).toHaveProperty('errors.0.name', 'MutationNotAllowedError');
    expect(result).toHaveProperty('errors.0.message', 'Cannot toggle gauge for all-at-once sources');
  });

  it('should not enable gauge without cron', async () => {
    const result = await runQuery(query, { id: GAUGE_NOR_2, enabled: true }, fakeContext(ADMIN));
    expect(result.errors).toBeDefined();
    expect(result.data!.toggleGauge).toBeNull();
    expect(result).toHaveProperty('errors.0.name', 'MutationNotAllowedError');
    expect(result).toHaveProperty('errors.0.message', 'Cron must be set to enable gauge');
  });

  it('should enable', async () => {
    const result = await runQuery(query, { id: GAUGE_NOR_4, enabled: true }, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.toggleGauge).toMatchObject({
      id: GAUGE_NOR_4,
      enabled: true,
    });
  });

  it('should start job', async () => {
    await runQuery(query, { id: GAUGE_NOR_4, enabled: true }, fakeContext(ADMIN));
    expect(startJobs).lastCalledWith(SOURCE_NORWAY, GAUGE_NOR_4);
  });

  it('should disable', async () => {
    const result = await runQuery(query, nor1, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.toggleGauge).toMatchObject({
      ...nor1,
    });
  });

  it('should stop job', async () => {
    await runQuery(query, { id: GAUGE_NOR_1, enabled: false }, fakeContext(ADMIN));
    expect(stopJobs).lastCalledWith(SOURCE_NORWAY, GAUGE_NOR_1);
  });

});
