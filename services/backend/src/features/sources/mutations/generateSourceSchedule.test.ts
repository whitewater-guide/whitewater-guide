import { holdTransaction, rollbackTransaction } from '@db';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '@seeds/01_users';
import {
  SOURCE_GALICIA_1,
  SOURCE_GEORGIA,
  SOURCE_NORWAY,
} from '@seeds/05_sources';
import {
  GAUGE_GEO_1,
  GAUGE_GEO_2,
  GAUGE_GEO_3,
  GAUGE_GEO_4,
} from '@seeds/06_gauges';
import { anonContext, fakeContext, runQuery } from '@test';
import { ApolloErrorCodes } from '@whitewater-guide/commons';

const query = `
  mutation generateSourceSchedule($id: ID!, $linkedOnly: Boolean){
    generateSourceSchedule(id: $id, linkedOnly: $linkedOnly) {
      id
      cron
    }
  }
`;

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await runQuery(
      query,
      { id: SOURCE_GALICIA_1 },
      anonContext(),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should not pass', async () => {
    const result = await runQuery(
      query,
      { id: SOURCE_GALICIA_1 },
      fakeContext(TEST_USER),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editor should not pass', async () => {
    const result = await runQuery(
      query,
      { id: SOURCE_GALICIA_1 },
      fakeContext(EDITOR_GA_EC),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });
});

describe('effects', () => {
  it('should fail for all-at-once sources', async () => {
    const result = await runQuery(
      query,
      { id: SOURCE_GALICIA_1 },
      fakeContext(ADMIN),
    );
    expect(result).toHaveGraphqlError(
      ApolloErrorCodes.MUTATION_NOT_ALLOWED,
      'Cannot generate schedule for all-at-once sources',
    );
  });

  it('should fail for enabled sources', async () => {
    const result = await runQuery(
      query,
      { id: SOURCE_NORWAY },
      fakeContext(ADMIN),
    );
    expect(result).toHaveGraphqlError(
      ApolloErrorCodes.MUTATION_NOT_ALLOWED,
      'Disable source first',
    );
  });

  it('should return gauges with crons', async () => {
    const result = await runQuery(
      query,
      { id: SOURCE_GEORGIA, linkedOnly: false },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data!.generateSourceSchedule).toEqual([
      { id: GAUGE_GEO_1, cron: '0 * * * *' },
      { id: GAUGE_GEO_2, cron: '15 * * * *' },
      { id: GAUGE_GEO_3, cron: '30 * * * *' },
      { id: GAUGE_GEO_4, cron: '45 * * * *' },
    ]);
  });

  it('should generate for linked only', async () => {
    const result = await runQuery(
      query,
      { id: SOURCE_GEORGIA, linkedOnly: true },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data!.generateSourceSchedule).toEqual([
      { id: GAUGE_GEO_1, cron: '0 * * * *' },
      { id: GAUGE_GEO_2, cron: null },
      { id: GAUGE_GEO_3, cron: null },
      { id: GAUGE_GEO_4, cron: '30 * * * *' },
    ]);
  });

  it('should overwrite linked only', async () => {
    await runQuery(
      query,
      { id: SOURCE_GEORGIA, linkedOnly: false },
      fakeContext(ADMIN),
    );
    const result = await runQuery(
      query,
      { id: SOURCE_GEORGIA, linkedOnly: true },
      fakeContext(ADMIN),
    );
    expect(result.data!.generateSourceSchedule).toEqual([
      { id: GAUGE_GEO_1, cron: '0 * * * *' },
      { id: GAUGE_GEO_2, cron: null },
      { id: GAUGE_GEO_3, cron: null },
      { id: GAUGE_GEO_4, cron: '30 * * * *' },
    ]);
  });
});
