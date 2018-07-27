import { holdTransaction, rollbackTransaction } from '@db';
import { startJobs, stopJobs } from '@features/jobs';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '@seeds/01_users';
import { SOURCE_GALICIA_1, SOURCE_NORWAY } from '@seeds/05_sources';
import { GAUGE_NOR_1, GAUGE_NOR_3, GAUGE_NOR_4 } from '@seeds/06_gauges';
import { anonContext, fakeContext, runQuery } from '@test';

jest.mock('@features/jobs', () => ({
  startJobs: jest.fn(),
  stopJobs: jest.fn(),
}));

const mutation = `
  mutation toggleAllGauges($sourceId: ID!, $enabled: Boolean!){
    toggleAllGauges(sourceId: $sourceId, enabled: $enabled) {
      id
      enabled
    }
  }
`;

const gal = { sourceId: SOURCE_GALICIA_1, enabled: true };
const norOn = { sourceId: SOURCE_NORWAY, enabled: true };
const norOff = { sourceId: SOURCE_NORWAY, enabled: false };

beforeEach(async () => {
  jest.clearAllMocks();
  await holdTransaction();
});
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await runQuery(mutation, gal, anonContext());
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result.data!.toggleAllGauges).toBeNull();
  });

  it('user should not pass', async () => {
    const result = await runQuery(mutation, gal, fakeContext(TEST_USER));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result.data!.toggleAllGauges).toBeNull();
  });

  it('editor should not pass', async () => {
    const result = await runQuery(mutation, gal, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result.data!.toggleAllGauges).toBeNull();
  });
});

describe('effects', () => {
  it('should not toggle gauges for all-at-once sources', async () => {
    const result = await runQuery(mutation, gal, fakeContext(ADMIN));
    expect(result.data!.toggleAllGauges).toBeNull();
    expect(result).toHaveProperty('errors.0.name', 'MutationNotAllowedError');
    expect(result).toHaveProperty('errors.0.message', 'Not allowed on all-at-once sources');
  });

  it('should not enable gauges without cron', async () => {
    const result = await runQuery(mutation, norOn, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.toggleAllGauges).not.toContain(expect.objectContaining({ id: GAUGE_NOR_3 }));
  });

  it('should enable and return only toggled', async () => {
    const result = await runQuery(mutation, norOn, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.toggleAllGauges).toMatchObject([
      { id: GAUGE_NOR_4, enabled: true },
    ]);
  });

  it('should start jobs', async () => {
    await runQuery(mutation, norOn, fakeContext(ADMIN));
    expect(startJobs).toBeCalledWith(SOURCE_NORWAY);
  });

  it('should disable and return only toggled', async () => {
    const result = await runQuery(mutation, norOff, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.toggleAllGauges).toMatchObject([
      { id: GAUGE_NOR_1, enabled: false },
      { id: GAUGE_NOR_3, enabled: false },
    ]);
  });

  it('should stop jobs', async () => {
    await runQuery(mutation, norOff, fakeContext(ADMIN));
    expect(stopJobs).toBeCalledWith(SOURCE_NORWAY);
  });
});
