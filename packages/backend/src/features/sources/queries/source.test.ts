import { holdTransaction, rollbackTransaction } from '../../../db';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '../../../seeds/test/01_users';
import { SOURCE_GALICIA_1 } from '../../../seeds/test/05_sources';
import { anonContext, fakeContext } from '../../../test/context';
import { noTimestamps, runQuery } from '../../../test/db-helpers';
import { Source } from '../../../ww-commons';

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
    }
  }
`;

const galiciaId = SOURCE_GALICIA_1;

describe('permissions', () => {
  it('anon shall not see internal fields', async () => {
    const result = await runQuery(query, { id: galiciaId }, anonContext());
    expect(result.errors).toBeUndefined();
    expect(result.data!.source).toMatchObject({
      script: null,
      harvestMode: null,
      cron: null,
    });
  });

  it('user shall not see internal fields', async () => {
    const result = await runQuery(query, { id: galiciaId }, fakeContext(TEST_USER));
    expect(result.errors).toBeUndefined();
    expect(result.data!.source).toMatchObject({
      script: null,
      harvestMode: null,
      cron: null,
    });
  });

  it('editor shall not see internal fields', async () => {
    const result = await runQuery(query, { id: galiciaId }, fakeContext(EDITOR_GA_EC));
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
    const result = await runQuery(query, { id: galiciaId }, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    const source: Source = result.data!.source;
    expect(source.id).toBe(galiciaId);
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
    const result = await runQuery(query, { id: galiciaId }, fakeContext(ADMIN, 'ru'));
    expect(result.data!.source).toMatchObject({
      name: 'Галисия',
      cron: '0 * * * *',
    });
  });

  it('should fall back to english when not translated', async () => {
    const result = await runQuery(query, { id: galiciaId }, fakeContext(ADMIN, 'pt'));
    expect(result.data!.source).toMatchObject({
      name: 'Galicia',
      cron: '0 * * * *',
    });
  });
});

describe('connections', () => {
  it('should return regions', async () => {
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
            }
          }
        }
      }
    `;
    const result = await runQuery(q, { id: galiciaId }, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    const source = result.data!.source;
    expect(source).toEqual(expect.objectContaining({
      id: '6d0d717e-aa9d-11e7-abc4-cec278b6b50a',
      name: 'Galicia',
      regions: {
        count: 2,
        nodes: [
          { id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34', name: 'Galicia' },
          { id: 'b968e2b2-76c5-11e7-b5a5-be2e44b06b34', name: 'Norway' },
        ],
      },
    }));
  });

  it('should return gauges', async () => {
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
            }
          }
        }
      }
    `;
    const result = await runQuery(q, { id: galiciaId }, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    const source = result.data!.source;
    expect(source.gauges.count).toBe(2);
    expect(source.gauges.nodes).toEqual([
      { id: 'aba8c106-aaa0-11e7-abc4-cec278b6b50a', name: 'Galicia gauge 1', code: 'gal1' },
      { id: 'b77ef1b2-aaa0-11e7-abc4-cec278b6b50a', name: 'Galicia gauge 2', code: 'gal2' },
    ]);
  });
});
