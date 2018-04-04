import { holdTransaction, rollbackTransaction } from '../../../db';
import { ADMIN, EDITOR_GA_EC, EDITOR_NO_EC, TEST_USER } from '../../../seeds/test/01_users';
import { REGION_GALICIA, REGION_NORWAY } from '../../../seeds/test/04_regions';
import { anonContext, fakeContext } from '../../../test/context';
import { noTimestamps, runQuery } from '../../../test/db-helpers';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query regionDetails($id: ID){
    region(id: $id) {
      id
      name
      description
      season
      seasonNumeric
      bounds
      hidden
      editable
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

describe('permissions', () => {
  it('anons should not see hidden region', async () => {
    const result = await runQuery(query, { id: REGION_NORWAY }, anonContext());
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.region', null);
  });

  it('users should not see hidden region', async () => {
    const result = await runQuery(query, { id: REGION_NORWAY }, fakeContext(TEST_USER));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.region', null);
  });

  it('editors should not see hidden non-editable region', async () => {
    const result = await runQuery(query, { id: REGION_NORWAY }, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.region', null);
  });

  it('editors should see hidden editable region', async () => {
    const result = await runQuery(query, { id: REGION_NORWAY }, fakeContext(EDITOR_NO_EC));
    expect(result.errors).toBeUndefined();
    expect(result).toHaveProperty('data.region.editable', true);
  });
});

describe('data', () => {
  it('should return null when id not specified', async () => {
    const result = await runQuery(query, {}, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();
    expect(result.data!.region).toBeNull();
  });

  it('should return region', async () => {
    const result = await runQuery(query, { id: REGION_GALICIA }, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    const region = result.data!.region;
    expect(region.hidden).not.toBeNull();
    expect(noTimestamps(region)).toMatchSnapshot();
  });

  it('should get rivers', async () => {
    const riversQuery = `
    query regionDetails($id: ID){
      region(id: $id) {
        id
        name
        rivers {
          nodes {
            id
            name
          }
          count
        }
      }
    }
  `;
    const result = await runQuery(riversQuery, { id: REGION_GALICIA }, fakeContext(EDITOR_NO_EC));
    expect(result.data!.region.rivers).toMatchSnapshot();
  });

  it('should get gauges', async () => {
    const gaugesQuery = `
    query regionDetails($id: ID){
      region(id: $id) {
        id
        name
        gauges {
          nodes {
            id
            name
          }
          count
        }
      }
    }
  `;
    // Norway
    const result = await runQuery(gaugesQuery, { id: 'b968e2b2-76c5-11e7-b5a5-be2e44b06b34' }, fakeContext(EDITOR_NO_EC));
    expect(result.data!.region.gauges.count).toEqual(6);
    expect(result.data!.region.gauges).toMatchSnapshot();
  });

  it('should get sections', async () => {
    const sectionsQuery = `
    query regionDetails($id: ID){
      region(id: $id) {
        id
        name
        sections {
          nodes {
            id
            name
          }
          count
        }
      }
    }
  `;
    // No pagination yet
    const result = await runQuery(sectionsQuery, { id: REGION_GALICIA }, fakeContext(EDITOR_NO_EC));
    expect(result.data!.region.sections.count).toEqual(2);
    expect(result.data!.region.sections).toMatchSnapshot();
  });
});

describe('i18n', () => {
  it('should be able to specify language', async () => {
    const result = await runQuery(query, { id: REGION_GALICIA }, fakeContext(EDITOR_NO_EC, 'ru'));
    expect(result.data!.region.name).toBe('Галисия');
  });

  it('should fall back to english when not translated', async () => {
    const result = await runQuery(query, { id: REGION_GALICIA }, fakeContext(EDITOR_NO_EC, 'pt'));
    expect(result.data!.region.name).toBe('Galicia');
  });

  it('should be able to get basic attributes without translation', async () => {
    const result = await runQuery(query, { id: REGION_GALICIA }, fakeContext(EDITOR_NO_EC, 'pt'));
    expect(result.data!.region.seasonNumeric).toEqual([20, 21]);
  });
});
