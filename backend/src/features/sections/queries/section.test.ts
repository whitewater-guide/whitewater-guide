import { holdTransaction, rollbackTransaction } from '../../../db';
import { noTimestamps, runQuery } from '../../../test/db-helpers';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query sectionDetails($id: ID, $language: String){
    section(id: $id, language: $language) {
      id
      language
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
        language
        name
        description
        kind
        coordinates
      }
      takeOut {
        id
        language
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
        language
        name
      }
      createdAt
      updatedAt
      pois {
        id
        language
        name
        description
        kind
        coordinates
      }
    }
  }
`;

it.only('should return simple data', async () => {
  const result = await runQuery(query, { id: '21f2351e-d52a-11e7-9296-cec278b6b50a' }); // Amot
  expect(result.errors).toBeUndefined();
  expect(result.data).toBeDefined();
  expect(result.data!.section).toBeDefined();
  expect(noTimestamps(result.data!.section)).toMatchSnapshot();
});

it('should return river', async () => {
  const riverQuery = `
    query sectionDetails($id: ID, $language: String){
      section(id: $id, language: $language) {
        id
        language
        name
        river {
          id
          language
          name
        }
      }
    }
  `;
  const result = await runQuery(riverQuery, { id: '21f2351e-d52a-11e7-9296-cec278b6b50a' }); // Amot
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.section.river.name', 'Sjoa');
});

it('should return gauge', async () => {
  const gaugeQuery = `
    query sectionDetails($id: ID, $language: String){
      section(id: $id, language: $language) {
        id
        language
        name
        gauge {
          id
          language
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
    query sectionDetails($id: ID, $language: String){
      section(id: $id, language: $language) {
        id
        language
        name
        region {
          id
          language
          name
        }
      }
    }
  `;
  const result = await runQuery(regionQuery, { id: '21f2351e-d52a-11e7-9296-cec278b6b50a' }); // Amot
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.section.region.name', 'Norway');
});

it('should return null when id not specified', async () => {
  const result = await runQuery(query, {});
  expect(result.errors).toBeUndefined();
  expect(result.data).toBeDefined();
  expect(result.data!.region).toBeNull();
});

it('should be able to specify language', async () => {
  const result = await runQuery(query, { id: '21f2351e-d52a-11e7-9296-cec278b6b50a', language: 'ru' }); // Amot
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.section.name', 'Шоа');
});

it('should return basic attributes when not translated', async () => {
  const result = await runQuery(query, { id: '21f2351e-d52a-11e7-9296-cec278b6b50a', language: 'pt' }); // Amot
  expect(result.errors).toBeUndefined();
  expect(result).toHaveProperty('data.section.name', 'Not translated');
  expect(result).toHaveProperty('data.section.rating', 5);
});
