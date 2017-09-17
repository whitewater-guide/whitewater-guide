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

const fullRegion: RegionInput = {
  id: null,
  name: 'Full region',
  description: 'Full region description',
  bounds: [[10, 20, 0], [10, 10, 0], [20, 20, 0]],
  season: 'season description',
  seasonNumeric: [1, 2, 3],
  hidden: false,
  pois: [],
};

const fullRegionWithPOIs: RegionInput = {
  ...fullRegion,
  pois: [
    { id: null, name: 'pt 1', description: 'pt 1 d', kind: 'other', coordinates: [10, 12, 0] },
    { id: null, name: 'pt 2', description: 'pt 2 d', kind: 'take-out', coordinates: [33, 34, 0] },
  ],
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
  let insertResult: any;
  let insertedRegion: any;

  beforeEach(async () => {
    insertResult = await runQuery(upsertQuery, { region: fullRegionWithPOIs }, adminContext);
    insertedRegion = insertResult && insertResult.data && insertResult.data.upsertRegion;
  });

  afterEach(() => {
    insertResult = null;
    insertedRegion = null;
  });

  test('should return result', async () => {
    expect(insertResult.errors).toBeUndefined();
    expect(insertResult.data).toBeDefined();
    expect(insertResult.data!.upsertRegion).toBeDefined();
  });

  test('should add one more region', async () => {
    const result = await db().table('regions').count();
    expect(result[0].count).toBe('4');
  });

  test('should return id', () => {
    expect(insertedRegion.id).toBeDefined();
    expect(isUUID(insertedRegion.id)).toBe(true);
  });

  test('should return timestamps', () => {
    expect(insertedRegion.createdAt).toBeDefined();
    expect(insertedRegion.updatedAt).toBeDefined();
    expect(isTimestamp(insertedRegion.createdAt)).toBe(true);
    expect(isTimestamp(insertedRegion.updatedAt)).toBe(true);
  });

  test('should return pois', () => {
    expect(insertedRegion.pois).toBeDefined();
    expect(insertedRegion.pois.length).toBe(2);
  });

  test('should insert POIs', async () => {
    const regionsPoints = await db().table('points_regions').count();
    const points = await db().table('points').count();
    const regionsPointsByRegion = await db().table('points_regions').where('region_id', insertedRegion.id).count();
    expect(regionsPoints[0].count).toBe('4');
    expect(points[0].count).toBe('4');
    expect(regionsPointsByRegion[0].count).toBe('2');
  });

  test('should match snapshot', () => {
    const snapshot: any = noUnstable(insertedRegion);
    snapshot.pois = snapshot.pois.map(noUnstable);
    expect(snapshot).toMatchSnapshot();
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