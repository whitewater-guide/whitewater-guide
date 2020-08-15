import db, { holdTransaction, rollbackTransaction } from '~/db';
import {
  ADMIN,
  EDITOR_GA_EC,
  EDITOR_NO,
  EDITOR_NO_EC,
  TEST_USER,
} from '~/seeds/test/01_users';
import { REGION_NORWAY } from '~/seeds/test/04_regions';
import { RIVER_BZHUZHA, RIVER_GAL_BECA } from '~/seeds/test/07_rivers';
import {
  GALICIA_BECA_LOWER,
  GEORGIA_BZHUZHA_LONG,
  NORWAY_SJOA_AMOT,
  SECTIONS_TOTAL,
  SECTIONS_VISIBLE,
} from '~/seeds/test/09_sections';
import { anonContext, fakeContext, noTimestamps, runQuery } from '~/test';
import { GALICIA_BECA_UPPER } from '../../../seeds/test/09_sections';

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
        verified
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
  expect(result).toHaveProperty('data.sections.nodes.0.river.name', 'Beca');
  expect(result).toHaveProperty('data.sections.nodes.0.name', 'Lower');
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
  const result = await runQuery(query, { filter: { riverId: RIVER_GAL_BECA } });
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

it('should search by name', async () => {
  const result = await runQuery(query, { filter: { search: 'long ' } });
  expect(result.errors).toBeUndefined();
  const ids = result.data.sections.nodes.map((n: any) => n.id);
  expect(ids).toEqual([GALICIA_BECA_LOWER, GEORGIA_BZHUZHA_LONG]);
});

it('should search full name (river + section)', async () => {
  const result = await runQuery(query, {
    filter: { search: ' bzhuzha long ' },
  });
  expect(result.errors).toBeUndefined();
  const ids = result.data.sections.nodes.map((n: any) => n.id);
  expect(ids).toEqual([GEORGIA_BZHUZHA_LONG]);
});

it('should filter recently updated', async () => {
  const id = '21f2351e-d52a-11e7-9296-cec278b6b50a';
  const update = await db()
    .update({ rating: 1 })
    .from('sections')
    .where({ id })
    .returning('updated_at');
  let u2: Date = update[0] as any;
  u2 = new Date(u2.getTime() - 300);
  const result = await runQuery(query, {
    filter: { updatedAfter: u2.toISOString() },
  });
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.sections.nodes.length', 1);
  expect(result).toHaveProperty('data.sections.count', 1);
  expect(result).toHaveProperty('data.sections.nodes.0.rating', 1);
});

it('should filter verified', async () => {
  const result = await runQuery(query, {
    filter: { verified: true },
  });
  expect(result.errors).toBeUndefined();
  expect(
    result.data.sections.nodes.find((n: any) => n.id === GALICIA_BECA_UPPER),
  ).toBeTruthy();
});

it('should filter non-verified', async () => {
  const result = await runQuery(query, {
    filter: { verified: false },
  });
  expect(result.errors).toBeUndefined();
  expect(
    result.data.sections.nodes.find((n: any) => n.id === GALICIA_BECA_UPPER),
  ).toBeUndefined();
  expect(
    result.data.sections.nodes.find((n: any) => n.id === GALICIA_BECA_LOWER),
  ).toBeTruthy();
  expect(
    result.data.sections.nodes.find((n: any) => n.id === NORWAY_SJOA_AMOT),
  ).toBeTruthy();
});

describe('filter editable', () => {
  it.each([
    ['anon', undefined],
    ['user', TEST_USER],
  ])('%s should get empty list', async (_, user: any) => {
    const result = await runQuery(
      query,
      {
        filter: { editable: true },
      },
      fakeContext(user),
    );
    expect(result.data.sections).toMatchObject({ nodes: [], count: 0 });
  });

  it('admin should have all sections as editable', async () => {
    const result = await runQuery(
      query,
      {
        filter: { editable: true },
      },
      fakeContext(ADMIN),
    );
    expect(result.data.sections.nodes).toHaveLength(SECTIONS_TOTAL);
  });

  it('editor get his editable sections', async () => {
    const result = await runQuery(
      query,
      {
        filter: { editable: true },
      },
      fakeContext(EDITOR_NO),
    );
    expect(result.data.sections.nodes).toContainEqual(
      expect.objectContaining({ id: NORWAY_SJOA_AMOT }),
    );
    expect(result.data.sections.nodes).not.toContainEqual(
      expect.objectContaining({ id: GALICIA_BECA_LOWER }),
    );
  });
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
