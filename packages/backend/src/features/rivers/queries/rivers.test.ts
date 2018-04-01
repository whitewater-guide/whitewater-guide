import { holdTransaction, rollbackTransaction } from '../../../db';
import { userContext } from '../../../test/context';
import { noTimestamps, runQuery } from '../../../test/db-helpers';

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
  expect(result).toHaveProperty('data.rivers.nodes.length', 4);
  expect(result).toHaveProperty('data.rivers.count', 4);
  expect(noTimestamps(result)).toMatchSnapshot();
});

it('should limit', async () => {
  const result = await runQuery(query, { page: { limit: 1 } });
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.rivers.nodes.length', 1);
  expect(result).toHaveProperty('data.rivers.nodes.0.name', 'Finna');
  expect(result).toHaveProperty('data.rivers.count', 4);
});

it('should paginate', async () => {
  const result = await runQuery(query, { page: { limit: 1, offset: 1 } });
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.rivers.nodes.length', 1);
  expect(result).toHaveProperty('data.rivers.nodes.0.name', 'Gal_Riv_One');
  expect(result).toHaveProperty('data.rivers.count', 4);
});

it('should be able to specify language', async () => {
  const result = await runQuery(query, { }, userContext('ru'));
  expect(result.errors).toBeUndefined();
  expect(result.data!.rivers.nodes).toEqual(expect.arrayContaining([
    expect.objectContaining({ name: 'Гал_Река_Один' }),
    expect.objectContaining({ name: 'Шоа' }),
    expect.objectContaining({ name: 'Finna' }),
  ]));
});

it('should return empty array of alt names when not translated', async () => {
  const result = await runQuery(query, { }, userContext('ru'));
  expect(result.data!.rivers.nodes).toEqual(expect.arrayContaining([
    expect.objectContaining({ altNames: [] }),
  ]));
});

it('should filter by region', async () => {
  const result = await runQuery(query, { filter: { regionId: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34' } });
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.rivers.nodes.length', 2);
  expect(result).toHaveProperty('data.rivers.count', 2);
});

it('should return sections', async () => {
  const result = await runQuery(query);
  expect(result).toHaveProperty('data.rivers.nodes.1.sections.count', 2);
  expect(result).toHaveProperty('data.rivers.nodes.1.sections.nodes.0.name', 'Gal_riv_1_sec_1');
});
