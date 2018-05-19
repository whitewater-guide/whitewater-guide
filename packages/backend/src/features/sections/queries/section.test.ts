import { holdTransaction, rollbackTransaction } from '../../../db';
import { ADMIN, EDITOR_GA_EC, EDITOR_NO_EC, TEST_USER } from '../../../seeds/test/01_users';
import { NORWAY_FINNA_GORGE, NORWAY_SJOA_AMOT } from '../../../seeds/test/09_sections';
import { anonContext, fakeContext } from '../../../test/context';
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
      hidden
      demo
    }
  }
`;

describe('permissions', () => {
  it('anon should not get hidden section', async () => {
    const result = await runQuery(query, { id: NORWAY_FINNA_GORGE }, anonContext());
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result.data!.section).toBeNull();
  });

  it('user should not get hidden section', async () => {
    const result = await runQuery(query, { id: NORWAY_FINNA_GORGE }, fakeContext(TEST_USER));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result.data!.section).toBeNull();
  });

  it('non-owning editor should not get hidden section', async () => {
    const result = await runQuery(query, { id: NORWAY_FINNA_GORGE }, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result.data!.section).toBeNull();
  });

  it('owning editor should get hidden section', async () => {
    const result = await runQuery(query, { id: NORWAY_FINNA_GORGE }, fakeContext(EDITOR_NO_EC));
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.section.hidden', true);
  });

  it('admin should get hidden section', async () => {
    const result = await runQuery(query, { id: NORWAY_FINNA_GORGE }, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.section.hidden', true);
  });
});

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
