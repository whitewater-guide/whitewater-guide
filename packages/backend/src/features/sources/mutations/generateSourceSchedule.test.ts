import { holdTransaction, rollbackTransaction } from '@db';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '@seeds/01_users';
import { SOURCE_GALICIA_1, SOURCE_GEORGIA, SOURCE_NORWAY } from '@seeds/05_sources';
import { GAUGE_GEO_1, GAUGE_GEO_2, GAUGE_GEO_3, GAUGE_GEO_4 } from '@seeds/06_gauges';
import { anonContext, fakeContext, runQuery } from '@test';

const query = `
  mutation generateSourceSchedule($id: ID!){
    generateSourceSchedule(id: $id) {
      id
      cron
    }
  }
`;

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await runQuery(query, { id: SOURCE_GALICIA_1 }, anonContext());
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.generateSourceSchedule', null);
  });

  it('user should not pass', async () => {
    const result = await runQuery(query, { id: SOURCE_GALICIA_1 }, fakeContext(TEST_USER));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.generateSourceSchedule', null);
  });

  it('editor should not pass', async () => {
    const result = await runQuery(query, { id: SOURCE_GALICIA_1 }, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.generateSourceSchedule', null);
  });
});

describe('effects', () => {

  it('should fail for all-at-once sources', async () => {
    const result = await runQuery(query, { id: SOURCE_GALICIA_1 }, fakeContext(ADMIN));
    expect(result.errors).toBeDefined();
    expect(result.data!.generateSourceSchedule).toBeNull();
    expect(result).toHaveProperty('errors.0.name', 'MutationNotAllowedError');
    expect(result).toHaveProperty('errors.0.message', 'Cannot generate schedule for all-at-once sources');
  });

  it('should fail for enabled sources', async () => {
    const result = await runQuery(query, { id: SOURCE_NORWAY }, fakeContext(ADMIN));
    expect(result.errors).toBeDefined();
    expect(result.data!.generateSourceSchedule).toBeNull();
    expect(result).toHaveProperty('errors.0.name', 'MutationNotAllowedError');
    expect(result).toHaveProperty('errors.0.message', 'Disable source first');
  });

  it('should return gauges with crons', async () => {
    const result = await runQuery(query, { id: SOURCE_GEORGIA }, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.generateSourceSchedule).toMatchObject([
      { id: GAUGE_GEO_1, cron: '0 * * * *' },
      { id: GAUGE_GEO_2, cron: '15 * * * *' },
      { id: GAUGE_GEO_3, cron: '30 * * * *' },
      { id: GAUGE_GEO_4, cron: '45 * * * *' },
    ]);
  });

});
