import { holdTransaction, rollbackTransaction } from '../../../db';
import { SOURCE_GALICIA_1, SOURCE_GEORGIA, SOURCE_NORWAY } from '../../../seeds/test/04_sources';
import { GAUGE_GEO_1, GAUGE_GEO_2, GAUGE_GEO_3, GAUGE_GEO_4 } from '../../../seeds/test/05_gauges';
import { adminContext, anonContext, userContext } from '../../../test/context';
import { runQuery } from '../../../test/db-helpers';

const query = `
  mutation generateSourceSchedule($id: ID!){
    generateSourceSchedule(id: $id) {
      id
      language
      cron
    }
  }
`;

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await runQuery(query, { id: SOURCE_GALICIA_1 }, anonContext);
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.generateSourceSchedule).toBeNull();
  });

  it('user should not pass', async () => {
    const result = await runQuery(query, { id: SOURCE_GALICIA_1 }, userContext);
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.generateSourceSchedule).toBeNull();
  });
});

describe('effects', () => {

  it('should fail for all-at-once sources', async () => {
    const result = await runQuery(query, { id: SOURCE_GALICIA_1 }, adminContext);
    expect(result.errors).toBeDefined();
    expect(result.data!.generateSourceSchedule).toBeNull();
    expect(result).toHaveProperty('errors.0.name', 'MutationNotAllowedError');
    expect(result).toHaveProperty('errors.0.message', 'Cannot generate schedule for all-at-once sources');
  });

  it('should fail for enabled sources', async () => {
    const result = await runQuery(query, { id: SOURCE_NORWAY }, adminContext);
    expect(result.errors).toBeDefined();
    expect(result.data!.generateSourceSchedule).toBeNull();
    expect(result).toHaveProperty('errors.0.name', 'MutationNotAllowedError');
    expect(result).toHaveProperty('errors.0.message', 'Disable source first');
  });

  it('should return gauges with crons', async () => {
    const result = await runQuery(query, { id: SOURCE_GEORGIA }, adminContext);
    expect(result.errors).toBeUndefined();
    expect(result.data!.generateSourceSchedule).toMatchObject([
      { id: GAUGE_GEO_1, cron: '0 * * * *' },
      { id: GAUGE_GEO_2, cron: '15 * * * *' },
      { id: GAUGE_GEO_3, cron: '30 * * * *' },
      { id: GAUGE_GEO_4, cron: '45 * * * *' },
    ]);
  });

});
