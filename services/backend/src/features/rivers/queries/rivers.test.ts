import { holdTransaction, rollbackTransaction } from '@db';
import { EDITOR_NO_EC } from '@seeds/01_users';
import { REGION_GALICIA } from '@seeds/04_regions';
import { RIVERS_TOTAL } from '@seeds/07_rivers';
import { fakeContext, noTimestamps, runQuery } from '@test';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query listRivers($page: Page, $filter: RiversFilter){
    rivers(page: $page, filter: $filter) {
      nodes {
        id
        name
        altNames
        region {
          id
          name
        }
        sections {
          nodes {
            id
            name
          }
          count
        }
        createdAt
        updatedAt
      }
      count
    }
  }
`;

it('should return rivers', async () => {
  const result = await runQuery(query);
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.rivers.nodes.length', RIVERS_TOTAL);
  expect(result).toHaveProperty('data.rivers.count', RIVERS_TOTAL);
  expect(noTimestamps(result.data!.rivers)).toMatchSnapshot();
});

it('should limit', async () => {
  const result = await runQuery(query, { page: { limit: 1 } });
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.rivers.nodes.length', 1);
  expect(result).toHaveProperty('data.rivers.nodes.0.name', 'Bzhuzha');
  expect(result).toHaveProperty('data.rivers.count', RIVERS_TOTAL);
});

it('should paginate', async () => {
  const result = await runQuery(query, { page: { limit: 1, offset: 1 } });
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.rivers.nodes.length', 1);
  expect(result).toHaveProperty('data.rivers.nodes.0.name', 'Finna');
  expect(result).toHaveProperty('data.rivers.count', RIVERS_TOTAL);
});

it('should be able to specify language', async () => {
  const result = await runQuery(query, {}, fakeContext(EDITOR_NO_EC, 'ru'));
  expect(result.errors).toBeUndefined();
  expect(result.data!.rivers.nodes).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ name: 'Гал_Река_Один' }),
      expect.objectContaining({ name: 'Шоа' }),
      expect.objectContaining({ name: 'Finna' }),
    ]),
  );
});

it('should return empty array of alt names when not translated', async () => {
  const result = await runQuery(query, {}, fakeContext(EDITOR_NO_EC, 'ru'));
  expect(result.data!.rivers.nodes).toEqual(
    expect.arrayContaining([expect.objectContaining({ altNames: [] })]),
  );
});

it('should filter by region', async () => {
  const result = await runQuery(query, {
    filter: { regionId: REGION_GALICIA },
  });
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.rivers.nodes.length', 2);
  expect(result).toHaveProperty('data.rivers.count', 2);
});

it('should search by name', async () => {
  const result = await runQuery(query, {
    filter: { regionId: REGION_GALICIA, search: 'one' },
  });
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.rivers.nodes.length', 1);
  expect(result).toHaveProperty('data.rivers.count', 1);
});

it('should return sections', async () => {
  const result = await runQuery(query, {
    filter: { regionId: REGION_GALICIA },
  });
  expect(result).toHaveProperty('data.rivers.nodes.0.sections.count', 2);
  expect(result).toHaveProperty(
    'data.rivers.nodes.0.sections.nodes.0.name',
    'Gal_riv_1_sec_1',
  );
});
