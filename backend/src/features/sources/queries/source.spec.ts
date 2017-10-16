import { holdTransaction, rollbackTransaction } from '../../../db';
import { adminContext, anonContext, superAdminContext, userContext } from '../../../test/context';
import { noTimestamps, runQuery } from '../../../test/db-helpers';
import { Source } from '../../../ww-commons';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query sourceDetails($id: ID, $language: String){
    source(id: $id, language: $language) {
      id
      language
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

const galiciaId = '6d0d717e-aa9d-11e7-abc4-cec278b6b50a';

describe('anonymous', () => {
  test('shall not pass', async () => {
    const result = await runQuery(query, { id: galiciaId }, anonContext);
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.source).toBeNull();
    expect(result).toMatchSnapshot();
  });
});

describe('user', () => {
  test('shall not pass', async () => {
    const result = await runQuery(query, { id: galiciaId }, userContext);
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.source).toBeNull();
    expect(result).toMatchSnapshot();
  });
});

describe('admin', () => {
  test('should return source', async () => {
    const result = await runQuery(query, { id: galiciaId }, adminContext);
    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();
    expect(result.data!.source).toBeTruthy();
    const source: Source = result.data!.source;
    expect(source.id).toBe(galiciaId);
    expect(noTimestamps(source)).toMatchSnapshot();
  });
});

describe('superadmin', () => {
  test('should return source', async () => {
    const result = await runQuery(query, { id: galiciaId }, superAdminContext);
    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();
    const source: Source = result.data!.source;
    expect(source.id).toBe(galiciaId);
    expect(noTimestamps(source)).toMatchSnapshot();
  });
});

describe('i18n', () => {
  test('should be able to specify language', async () => {
    const result = await runQuery(query, { id: galiciaId, language: 'ru' }, superAdminContext);
    expect(result.data!.source.name).toBe('Галисия');
  });

  test('should be able to get basic attributes without translation', async () => {
    const result = await runQuery(query, { id: galiciaId, language: 'pt' }, superAdminContext);
    expect(result.data!.source.cron).toBe('0 * * * *');
    expect(result.data!.source.name).toBe('Not translated');
  });
});

describe('connections', () => {
  test('should return regions', async () => {
    const q = `
      query sourceDetails($id: ID){
        source(id: $id) {
          id
          language
          name
          regions {
            count
            nodes {
              id
              language
              name
            }
          }
        }
      }
    `;
    const result = await runQuery(q, { id: galiciaId }, superAdminContext);
    expect(result.errors).toBeUndefined();
    const source = result.data!.source;
    expect(source).toEqual(expect.objectContaining({
      id: '6d0d717e-aa9d-11e7-abc4-cec278b6b50a',
      name: 'Galicia',
      language: 'en',
      regions: {
        count: 2,
        nodes: [
          { id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34', language: 'en', name: 'Galicia' },
          { id: 'b968e2b2-76c5-11e7-b5a5-be2e44b06b34', language: 'en', name: 'Hidden region' },
        ],
      },
    }));
  });
});
