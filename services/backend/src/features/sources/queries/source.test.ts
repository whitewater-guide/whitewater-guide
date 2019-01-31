import { holdTransaction, rollbackTransaction } from '@db';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '@seeds/01_users';
import { SOURCE_GALICIA_1, SOURCE_NORWAY } from '@seeds/05_sources';
import { GAUGE_NOR_2 } from '@seeds/06_gauges';
import { anonContext, fakeContext, noTimestamps, runQuery } from '@test';
import { Source } from '@whitewater-guide/commons';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query sourceDetails($id: ID){
    source(id: $id) {
      id
      name
      url
      script
      harvestMode
      cron
      enabled
      createdAt
      updatedAt
      __typename
    }
  }
`;

describe('permissions', () => {
  it('anon shall not see internal fields', async () => {
    const result = await runQuery(
      query,
      { id: SOURCE_GALICIA_1 },
      anonContext(),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data!.source).toMatchObject({
      script: null,
      harvestMode: null,
      cron: null,
    });
  });

  it('user shall not see internal fields', async () => {
    const result = await runQuery(
      query,
      { id: SOURCE_GALICIA_1 },
      fakeContext(TEST_USER),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data!.source).toMatchObject({
      script: null,
      harvestMode: null,
      cron: null,
    });
  });

  it('editor shall not see internal fields', async () => {
    const result = await runQuery(
      query,
      { id: SOURCE_GALICIA_1 },
      fakeContext(EDITOR_GA_EC),
    );
    expect(result.errors).toBeUndefined();
    expect(result.data!.source).toMatchObject({
      script: null,
      harvestMode: null,
      cron: null,
    });
  });
});

describe('data', () => {
  it('should return source', async () => {
    const result = await runQuery(
      query,
      { id: SOURCE_GALICIA_1 },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    const source: Source = result.data!.source;
    expect(source.id).toBe(SOURCE_GALICIA_1);
    expect(noTimestamps(source)).toMatchSnapshot();
  });

  it('should return null when id not specified', async () => {
    const result = await runQuery(query, {}, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();
    expect(result.data!.source).toBeNull();
  });
});

describe('i18n', () => {
  it('should be able to specify language', async () => {
    const result = await runQuery(
      query,
      { id: SOURCE_GALICIA_1 },
      fakeContext(ADMIN, 'ru'),
    );
    expect(result.data!.source).toMatchObject({
      name: 'Галисия',
      cron: '0 * * * *',
    });
  });

  it('should fall back to english when not translated', async () => {
    const result = await runQuery(
      query,
      { id: SOURCE_GALICIA_1 },
      fakeContext(ADMIN, 'pt'),
    );
    expect(result.data!.source).toMatchObject({
      name: 'Galicia',
      cron: '0 * * * *',
    });
  });
});

describe('connections', () => {
  describe('regions', () => {
    it('should return nodes', async () => {
      const q = `
      query sourceDetails($id: ID){
        source(id: $id) {
          id
          name
          regions {
            count
            nodes {
              id
              name
              __typename
            }
            __typename
          }
          __typename
        }
      }
    `;
      const result = await runQuery(
        q,
        { id: SOURCE_GALICIA_1 },
        fakeContext(ADMIN),
      );
      expect(result.errors).toBeUndefined();
      const source = result.data!.source;
      expect(source).toMatchObject({
        id: SOURCE_GALICIA_1,
        name: 'Galicia',
        regions: {
          count: 2,
          nodes: [
            { id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34', name: 'Galicia' },
            { id: 'b968e2b2-76c5-11e7-b5a5-be2e44b06b34', name: 'Norway' },
          ],
        },
      });
    });

    it('should paginate', async () => {
      const q = `
      query sourceDetails($id: ID, $regionsPage: Page){
        source(id: $id) {
          id
          regions(page: $regionsPage) {
            count
            nodes {
              id
              name
              __typename
            }
            __typename
          }
          __typename
        }
      }
    `;
      const result = await runQuery(
        q,
        { id: SOURCE_GALICIA_1, regionsPage: { limit: 1, offset: 1 } },
        fakeContext(ADMIN),
      );
      expect(result.errors).toBeUndefined();
      expect(result.data!.source).toMatchObject({
        id: SOURCE_GALICIA_1,
        regions: {
          count: 2,
          nodes: [
            { id: 'b968e2b2-76c5-11e7-b5a5-be2e44b06b34', name: 'Norway' },
          ],
        },
      });
    });
  });

  describe('gauges', () => {
    it('should return nodes', async () => {
      const q = `
      query sourceDetails($id: ID){
        source(id: $id) {
          id
          name
          gauges {
            count
            nodes {
              id
              name
              code
              __typename
            }
            __typename
          }
          __typename
        }
      }
    `;
      const result = await runQuery(
        q,
        { id: SOURCE_GALICIA_1 },
        fakeContext(ADMIN),
      );
      expect(result.errors).toBeUndefined();
      const source = result.data!.source;
      expect(source.gauges.count).toBe(2);
      expect(source.gauges.nodes).toHaveLength(2);
      expect(source.gauges.nodes).toMatchObject([
        {
          id: 'aba8c106-aaa0-11e7-abc4-cec278b6b50a',
          name: 'Galicia gauge 1',
          code: 'gal1',
        },
        {
          id: 'b77ef1b2-aaa0-11e7-abc4-cec278b6b50a',
          name: 'Galicia gauge 2',
          code: 'gal2',
        },
      ]);
    });

    it('should paginate', async () => {
      const q = `
      query sourceDetails($id: ID, $page: Page){
        source(id: $id) {
          id
          gauges(page: $page) {
            count
            nodes {
              id
              code
              __typename
            }
            __typename
          }
          __typename
        }
      }
    `;
      const result = await runQuery(
        q,
        { id: SOURCE_NORWAY, page: { limit: 1, offset: 1 } },
        fakeContext(ADMIN),
      );
      expect(result.errors).toBeUndefined();
      const source = result.data!.source;
      expect(source.gauges.count).toBe(4);
      expect(source.gauges.nodes).toHaveLength(1);
      expect(source.gauges.nodes).toMatchObject([
        { id: GAUGE_NOR_2, code: 'nor2' },
      ]);
    });
  });
});