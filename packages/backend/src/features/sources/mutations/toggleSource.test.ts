import { MutationNotAllowedError } from '../../../apollo';
import { holdTransaction, rollbackTransaction } from '../../../db';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '../../../seeds/test/01_users';
import { SOURCE_ALPS, SOURCE_GALICIA_1, SOURCE_GALICIA_2, SOURCE_NORWAY } from '../../../seeds/test/04_sources';
import { anonContext, fakeContext } from '../../../test/context';
import { runQuery } from '../../../test/db-helpers';
import { startJobs, stopJobs } from '../../jobs';

jest.mock('../../jobs', () => ({
  startJobs: jest.fn(),
  stopJobs: jest.fn(),
}));

const query = `
  mutation toggleSource($id: ID!, $enabled: Boolean!){
    toggleSource(id: $id, enabled: $enabled) {
      id
      enabled
    }
  }
`;

const gal1 = { id: SOURCE_GALICIA_1, enabled: true };
const gal2 = { id: SOURCE_GALICIA_2, enabled: true };
const nor = { id: SOURCE_NORWAY, enabled: false };

beforeEach(async () => {
  jest.clearAllMocks();
  await holdTransaction();
});
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await runQuery(query, gal1, anonContext());
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.toggleSource', null);
  });

  it('user should not pass', async () => {
    const result = await runQuery(query, gal1, fakeContext(TEST_USER));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.toggleSource', null);
  });

  it('editor should not pass', async () => {
    const result = await runQuery(query, gal1, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.toggleSource', null);
  });
});

describe('effects', () => {
  it('should not enable all-at-once sources without cron', async () => {
    const result = await runQuery(query, gal2, fakeContext(ADMIN));
    expect(result.errors).toBeDefined();
    expect(result.data!.toggleSource).toBeNull();
    expect(result).toHaveProperty('errors.0.name', 'MutationNotAllowedError');
    expect(result).toHaveProperty('errors.0.message', 'Cron must be set');
  });

  it('should enable', async () => {
    const result = await runQuery(query, gal1, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.toggleSource).toMatchObject({
      ...gal1,
    });
  });

  it('should start jobs', async () => {
    await runQuery(query, gal1, fakeContext(ADMIN));
    expect(startJobs).lastCalledWith(SOURCE_GALICIA_1);
  });

  it('should disable', async () => {
    const result = await runQuery(query, nor, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.toggleSource).toMatchObject({
      ...nor,
    });
  });

  it('should stop jobs', async () => {
    await runQuery(query, { id: SOURCE_ALPS, enabled: false }, fakeContext(ADMIN));
    expect(stopJobs).lastCalledWith(SOURCE_ALPS);
  });
});
