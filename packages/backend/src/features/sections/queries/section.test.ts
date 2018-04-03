import { holdTransaction, rollbackTransaction } from '../../../db';
import { EDITOR_NO_EC } from '../../../seeds/test/01_users';
import { NORWAY_SJOA_AMOT } from '../../../seeds/test/08_sections';
import { fakeContext } from '../../../test/context';
import { noTimestamps, runQuery } from '../../../test/db-helpers';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query sectionDetails($id: ID){
    section(id: $id) {
      id
      name
      description
      season
      seasonNumeric
      levels {
        minimum
        maximum
        optimum
        impossible
        approximate
      }
      flows {
        minimum
        maximum
        optimum
        impossible
        approximate
      }
      flowsText
      putIn {
        id
        name
        description
        kind
        coordinates
      }
      takeOut {
        id
        name
        description
        kind
        coordinates
      }
      shape
      distance
      drop
      duration
      difficulty
      difficultyXtra
      rating
      tags {
        id
        name
      }
      createdAt
      updatedAt
      pois {
        id
        name
        description
        kind
        coordinates
      }
    }
  }
`;

it('should return simple data', async () => {
  const result = await runQuery(query, { id: NORWAY_SJOA_AMOT }); // Amot
  expect(result.errors).toBeUndefined();
  expect(result.data).toBeDefined();
  expect(result.data!.section).toBeDefined();
  expect(noTimestamps(result.data!.section)).toMatchSnapshot();
});

it('should return river', async () => {
  const riverQuery = `
    query sectionDetails($id: ID){
      section(id: $id) {
        id
        name
        river {
          id
          name
        }
      }
    }
  `;
  const result = await runQuery(riverQuery, { id: NORWAY_SJOA_AMOT }); // Amot
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.section.river.name', 'Sjoa');
});

it('should return gauge', async () => {
  const gaugeQuery = `
    query sectionDetails($id: ID){
      section(id: $id) {
        id
        name
        gauge {
          id
          name
        }
      }
    }
  `;
  const result = await runQuery(gaugeQuery, { id: '2b01742c-d443-11e7-9296-cec278b6b50a' }); // Galicia riv 1 section 1
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.section.gauge.name', 'Galicia gauge 1');
});

it('should return region', async () => {
  const regionQuery = `
    query sectionDetails($id: ID){
      section(id: $id) {
        id
        name
        region {
          id
          name
        }
      }
    }
  `;
  const result = await runQuery(regionQuery, { id: NORWAY_SJOA_AMOT }); // Amot
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.section.region.name', 'Norway');
});

it('should return null when id not specified', async () => {
  const result = await runQuery(query, {});
  expect(result.errors).toBeUndefined();
  expect(result.data).toBeDefined();
  expect(result.data!.section).toBeNull();
});

it('should be able to specify language', async () => {
  const result = await runQuery(query, { id: NORWAY_SJOA_AMOT }, fakeContext(EDITOR_NO_EC, 'ru')); // Amot
  expect(result.errors).toBeUndefined();
  expect(result.data!.section).toMatchObject({
    name: 'Амот',
    description: 'Амот описание',
    distance: 3.2,
  });
});

it('should fall back to english when not translated', async () => {
  const result = await runQuery(query, { id: NORWAY_SJOA_AMOT }, fakeContext(EDITOR_NO_EC, 'pt')); // Amot
  expect(result.errors).toBeUndefined();
  expect(result.data!.section).toMatchObject({
    name: 'Amot',
    description: 'Amot description',
    distance: 3.2,
  });
});
