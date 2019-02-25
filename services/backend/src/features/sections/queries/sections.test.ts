import db, { holdTransaction, rollbackTransaction } from '@db';
import { ADMIN, EDITOR_GA_EC, EDITOR_NO_EC, TEST_USER } from '@seeds/01_users';
import { REGION_NORWAY } from '@seeds/04_regions';
import { RIVER_BZHUZHA, RIVER_GAL_1 } from '@seeds/07_rivers';
import { SECTIONS_TOTAL, SECTIONS_VISIBLE } from '@seeds/09_sections';
import { anonContext, fakeContext, noTimestamps, runQuery } from '@test';

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
        hidden
      }
      count
    }
  }
`;

describe('permissions', () => {
  it('anon should not see hidden sections', async () => {
    const result = await runQuery(query, {}, anonContext());
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty(
      'data.sections.nodes.length',
      SECTIONS_VISIBLE,
    );
    expect(result).toHaveProperty('data.sections.count', SECTIONS_VISIBLE);
  });

  it('user should not see hidden sections', async () => {
    const result = await runQuery(query, {}, fakeContext(TEST_USER));
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty(
      'data.sections.nodes.length',
      SECTIONS_VISIBLE,
    );
    expect(result).toHaveProperty('data.sections.count', SECTIONS_VISIBLE);
  });

  it('non-owning editor should not see hidden sections', async () => {
    const result = await runQuery(query, {}, fakeContext(EDITOR_GA_EC));
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty(
      'data.sections.nodes.length',
      SECTIONS_VISIBLE,
    );
    expect(result).toHaveProperty('data.sections.count', SECTIONS_VISIBLE);
  });

  it('owning editor should see hidden sections', async () => {
    const result = await runQuery(query, {}, fakeContext(EDITOR_NO_EC));
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.sections.nodes.length', SECTIONS_TOTAL);
    expect(result).toHaveProperty('data.sections.count', SECTIONS_TOTAL);
  });

  it('admin should see hidden sections', async () => {
    const result = await runQuery(query, {}, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.sections.nodes.length', SECTIONS_TOTAL);
    expect(result).toHaveProperty('data.sections.count', SECTIONS_TOTAL);
  });
});

it('should return sections', async () => {
  const result = await runQuery(query);
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.sections.nodes.length', SECTIONS_VISIBLE);
  expect(result).toHaveProperty('data.sections.count', SECTIONS_VISIBLE);
  expect(noTimestamps(result.data!.sections)).toMatchSnapshot();
});

it('should limit', async () => {
  const result = await runQuery(query, { page: { limit: 1 } });
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.sections.nodes.length', 1);
  expect(result).toHaveProperty('data.sections.nodes.0.name', 'Extreme race');
  expect(result).toHaveProperty('data.sections.count', SECTIONS_VISIBLE);
});

it('should paginate', async () => {
  const result = await runQuery(query, { page: { limit: 1, offset: 1 } });
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.sections.nodes.length', 1);
  expect(result).toHaveProperty('data.sections.count', SECTIONS_VISIBLE);
});

it('should be able to specify language', async () => {
  const result = await runQuery(query, {}, fakeContext(EDITOR_NO_EC, 'ru'));
  expect(result.errors).toBeUndefined();
  expect(result.data!.sections.nodes).toContainEqual(
    expect.objectContaining({
      name: 'Амот',
      rating: 5,
    }),
  );
});

it('should fall back to english when not translated', async () => {
  const result = await runQuery(query, {}, fakeContext(EDITOR_NO_EC, 'pt'));
  expect(result.errors).toBeUndefined();
  expect(result.data!.sections.nodes).toContainEqual(
    expect.objectContaining({
      name: 'Amot',
      rating: 5,
    }),
  );
});

it('should filter by river', async () => {
  const result = await runQuery(query, { filter: { riverId: RIVER_GAL_1 } });
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.sections.nodes.length', 2);
  expect(result).toHaveProperty('data.sections.count', 2);
});

it('should filter by region', async () => {
  const result = await runQuery(query, { filter: { regionId: REGION_NORWAY } });
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.sections.nodes.length', 1);
  expect(result).toHaveProperty('data.sections.count', 1);
});

it('should filter recently updated', async () => {
  const id = '21f2351e-d52a-11e7-9296-cec278b6b50a';
  const [u2] = await db()
    .update({ rating: 1 })
    .from('sections')
    .where({ id })
    .returning('updated_at');
  const result = await runQuery(query, {
    filter: { updatedAfter: u2.toISOString() },
  });
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.sections.nodes.length', 1);
  expect(result).toHaveProperty('data.sections.count', 1);
  expect(result).toHaveProperty('data.sections.nodes.0.rating', 1);
});

it('should fire two queries for sections->region with only region name queried', async () => {
  const regionQuery = `
    query listSections($page: Page, $filter: SectionsFilter){
      sections(page: $page, filter: $filter) {
        nodes {
          id
          name
          region {
            id
            name
          }
        }
      }
    }
  `;

  const queryMock = jest.fn();
  db().on('query', queryMock);
  await runQuery(regionQuery, { filter: { regionId: REGION_NORWAY } });
  db().removeListener('query', queryMock);
  expect(queryMock).toHaveBeenCalledTimes(1);
});

it('should fire one query for sections->river with only river name queried', async () => {
  const riverQuery = `
    query listSections($page: Page, $filter: SectionsFilter){
      sections(page: $page, filter: $filter) {
        __typename
        nodes {
          __typename
          id
          name
          river {
            __typename
            id
            name
          }
        }
      }
    }
  `;
  const queryMock = jest.fn();
  db().on('query', queryMock);
  await runQuery(riverQuery, { filter: { riverId: RIVER_BZHUZHA } });
  db().removeListener('query', queryMock);
  expect(queryMock).toHaveBeenCalledTimes(1);
});
