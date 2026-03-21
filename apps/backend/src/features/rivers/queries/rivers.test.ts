import { gql } from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '../../../db/index';
import { EDITOR_NO_EC } from '../../../seeds/test/01_users';
import { REGION_GALICIA } from '../../../seeds/test/04_regions';
import { RIVERS_TOTAL } from '../../../seeds/test/07_rivers';
import { fakeContext, noTimestamps } from '../../../test/index';
import { testListRivers } from './rivers.test.generated';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const _query = gql`
  query listRivers($page: Page, $filter: RiversFilter) {
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
  const result = await testListRivers();
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.rivers.nodes.length', RIVERS_TOTAL);
  expect(result).toHaveProperty('data.rivers.count', RIVERS_TOTAL);
  expect(noTimestamps(result.data?.rivers)).toMatchSnapshot();
});

it('should limit', async () => {
  const result = await testListRivers({ page: { limit: 1 } });
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.rivers.nodes.length', 1);
  expect(result).toHaveProperty('data.rivers.nodes.0.name', 'Beca');
  expect(result).toHaveProperty('data.rivers.count', RIVERS_TOTAL);
});

it('should paginate', async () => {
  const result = await testListRivers({ page: { limit: 1, offset: 1 } });
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.rivers.nodes.length', 1);
  expect(result).toHaveProperty('data.rivers.nodes.0.name', 'Bzhuzha');
  expect(result).toHaveProperty('data.rivers.count', RIVERS_TOTAL);
});

it('should be able to specify language', async () => {
  const result = await testListRivers({}, fakeContext(EDITOR_NO_EC, 'ru'));
  expect(result.errors).toBeUndefined();
  expect(result.data?.rivers.nodes).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ name: 'Беса' }),
      expect.objectContaining({ name: 'Шоа' }),
      expect.objectContaining({ name: 'Finna' }),
    ]),
  );
});

it('should return empty array of alt names when not translated', async () => {
  const result = await testListRivers({}, fakeContext(EDITOR_NO_EC, 'ru'));
  expect(result.data?.rivers.nodes).toEqual(
    expect.arrayContaining([expect.objectContaining({ altNames: [] })]),
  );
});

it('should filter by region', async () => {
  const result = await testListRivers({
    filter: { regionId: REGION_GALICIA },
  });
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.rivers.nodes.length', 2);
  expect(result).toHaveProperty('data.rivers.count', 2);
});

it('should search by name', async () => {
  const result = await testListRivers({
    filter: { regionId: REGION_GALICIA, search: 'eca' },
  });
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.rivers.nodes.length', 1);
  expect(result).toHaveProperty('data.rivers.count', 1);
});

it('should return sections', async () => {
  const result = await testListRivers({
    filter: { regionId: REGION_GALICIA },
  });
  expect(result).toHaveProperty('data.rivers.nodes.0.sections.count', 2);
  expect(result).toHaveProperty(
    'data.rivers.nodes.0.sections.nodes.0.name',
    'Lower',
  );
});
