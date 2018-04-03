import db, { holdTransaction, rollbackTransaction } from '../../../db';
import { EDITOR_NO_EC } from '../../../seeds/test/01_users';
import { fakeContext } from '../../../test/context';
import { noTimestamps, runQuery } from '../../../test/db-helpers';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query listSections($page: Page, $filter: SectionsFilter){
    sections(page: $page, filter: $filter) {
      nodes {
        id
        name
        rating
        river {
          id
          name
        }
        region {
          id
          name
        }
        gauge {
          id
          name
        }
      }
      count
    }
  }
`;

it('should return sections', async () => {
  const result = await runQuery(query);
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.sections.nodes.length', 3);
  expect(result).toHaveProperty('data.sections.count', 3);
  expect(noTimestamps(result)).toMatchSnapshot();
});

it('should limit', async () => {
  const result = await runQuery(query, { page: { limit: 1 } });
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.sections.nodes.length', 1);
  expect(result).toHaveProperty('data.sections.nodes.0.name', 'Amot');
  expect(result).toHaveProperty('data.sections.count', 3);
});

it('should paginate', async () => {
  const result = await runQuery(query, { page: { limit: 1, offset: 1 } });
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.sections.nodes.length', 1);
  expect(result).toHaveProperty('data.sections.nodes.0.name', 'Gal_riv_1_sec_1');
  expect(result).toHaveProperty('data.sections.count', 3);
});

it('should be able to specify language', async () => {
  const result = await runQuery(query, { }, fakeContext(EDITOR_NO_EC, 'ru'));
  expect(result.errors).toBeUndefined();
  expect(result.data!.sections.nodes).toContainEqual(expect.objectContaining({
    name: 'Амот',
    rating: 5,
  }));
});

it('should fall back to english when not translated', async () => {
  const result = await runQuery(query, { }, fakeContext(EDITOR_NO_EC, 'pt'));
  expect(result.errors).toBeUndefined();
  expect(result.errors).toBeUndefined();
  expect(result.data!.sections.nodes).toContainEqual(expect.objectContaining({
    name: 'Amot',
    rating: 5,
  }));
});

it('should filter by river', async () => {
  const result = await runQuery(query, { filter: { riverId: 'a8416664-bfe3-11e7-abc4-cec278b6b50a' } });
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.sections.nodes.length', 2);
  expect(result).toHaveProperty('data.sections.count', 2);
});

it('should filter by region', async () => {
  const result = await runQuery(query, { filter: { regionId: 'b968e2b2-76c5-11e7-b5a5-be2e44b06b34' } });
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.sections.nodes.length', 1);
  expect(result).toHaveProperty('data.sections.count', 1);
});

it('should filter recently updated', async () => {
  const id = '21f2351e-d52a-11e7-9296-cec278b6b50a';
  const [u2] = await db().update({ rating: 1 }).from('sections').where({ id }).returning('updated_at');
  const result = await runQuery(query, { filter: { updatedAfter: u2.toISOString() } });
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.sections.nodes.length', 1);
  expect(result).toHaveProperty('data.sections.count', 1);
  expect(result).toHaveProperty('data.sections.nodes.0.rating', 1);
});
