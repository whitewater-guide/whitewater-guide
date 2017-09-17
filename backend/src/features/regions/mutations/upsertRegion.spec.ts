import db, { holdTransaction, rollbackTransaction } from '../../../db';
import { adminContext, anonContext, userContext } from '../../../test/context';
import { isTimestamp, isUUID, noTimestamps, noUnstable, runQuery } from '../../../test/db-helpers';
import { RegionInput } from '../../../ww-commons';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const minimalRegion: RegionInput = {
  id: null,
  name: 'Minimal region',
  description: null,
  bounds: null,
  season: null,
  seasonNumeric: [],
  hidden: false,
  pois: [],
};

const upsertQuery = `
  mutation upsertRegion($region: RegionInput!){
    upsertRegion(region: $region){
      id
      name
      description
      season
      seasonNumeric
      bounds
      hidden
      riversCount
      sectionsCount
      createdAt
      updatedAt
      pois {
        id
        name
        description
        coordinates
        kind
      }
    }
  }
`;

describe('resolvers chain', () => {
  test('anon should not pass', async () => {
    const result = await runQuery(upsertQuery, { region: minimalRegion }, anonContext);
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.upsertRegion).toBeNull();
    expect(result).toMatchSnapshot();
  });

  test('user should not pass', async () => {
    const result = await runQuery(upsertQuery, { region: minimalRegion }, userContext);
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.upsertRegion).toBeNull();
    expect(result).toMatchSnapshot();
  });

  test('should throw on invalid input', async () => {
    const invalidInput: RegionInput = {
      id: null,
      name: 'x',
      description: null,
      season: null,
      seasonNumeric: [55],
      bounds: [[300, 300, 300]],
      hidden: false,
      pois: [],
    };
    const result = await runQuery(upsertQuery, { region: invalidInput }, adminContext);
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.upsertRegion).toBeNull();
    expect(result).toMatchSnapshot();
  });
});

describe('insert', () => {
  test('should return result', () => {
  });

  test('should add one more region', () => {
  });

  test('should return id', () => {
  });

  test('should return timestamps', () => {
  });

  test('should insert POIs', () => {
  });

  test('should match snapshot', () => {
  });
});

describe('update', () => {
  test('should return result', () => {
  });

  test('should not change total number of regions', () => {
  });

  test('should return id', () => {
  });

  test('should update updated_at timestamp', () => {
  });

  test('should update POI', () => {
  });

  test('should delete POI', () => {
  });

  test('should insert POI', () => {
  });

  test('should match snapshot', () => {
  });
});