import db, { holdTransaction, rollbackTransaction } from '../../../db';
import { adminContext, anonContext, userContext } from '../../../test/context';
import { isTimestamp, isUUID, noTimestamps, noUnstable, runQuery } from '../../../test/db-helpers';
import { RegionInput } from '../../../ww-commons';
import { PointRaw } from '../../points';
import { RegionRaw } from '../types';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const minimalRegion: RegionInput = {
  id: null,
  name: 'Minimal region',
  description: null,
  bounds: [[10, 20, 0], [10, 10, 0], [20, 20, 0]],
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

const fullRegionUpdate: RegionInput = {
  ...fullRegion,
  id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34',
  pois: [
    { id: null, name: 'pt 1 u', description: 'pt 1 upd', kind: 'other', coordinates: [10, 12, 0] }, // new
    { id: null, name: 'pt 2 u', description: 'pt 2 upd', kind: 'take-out', coordinates: [33, 34, 0] }, // new
    { id: 'd7530317-efac-44a7-92ff-8d045b2ac893',
      coordinates: [1, 2, 3],
      name: 'r 1 p 2',
      description: 'r1p2 d',
      kind: 'put-in',
    }, // Updated
    // And one is deleted
  ],
};

const fullRegionWithPOIs: RegionInput = {
  ...fullRegion,
  pois: [
    { id: null, name: 'pt 1', description: 'pt 1 d', kind: 'other', coordinates: [10, 12, 0] },
    { id: null, name: 'pt 2', description: 'pt 2 d', kind: 'take-out', coordinates: [33, 34, 0] },
  ],
};

const upsertQuery = `
  mutation upsertRegion($region: RegionInput!, $language: String){
    upsertRegion(region: $region, language: $language){
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
    const regionsPoints = await db().table('regions_points').count();
    const points = await db().table('points').count();
    const regionsPointsByRegion = await db().table('regions_points').where('region_id', insertedRegion.id).count();
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
  let oldRegion: RegionRaw | null;
  let updateResult: any;
  let updatedRegion: any;

  beforeEach(async () => {
    oldRegion = await db().table('regions_view').where({ id: fullRegionUpdate.id }).first();
    updateResult = await runQuery(upsertQuery, { region: fullRegionUpdate }, adminContext);
    updatedRegion = updateResult && updateResult.data && updateResult.data.upsertRegion;
  });

  afterEach(() => {
    updateResult = null;
    updatedRegion = null;
  });

  test('should return result', () => {
    expect(updateResult.errors).toBeUndefined();
    expect(updateResult.data).toBeDefined();
    expect(updateResult.data!.upsertRegion).toBeDefined();
  });

  test('should not change total number of regions', async () => {
    const result = await db().table('regions').count();
    expect(result[0].count).toBe('3');
  });

  test('should return id', () => {
    expect(updatedRegion.id).toBe(fullRegionUpdate.id);
  });

  test('should update updated_at timestamp', () => {
    expect(updatedRegion.createdAt).toBe(oldRegion!.created_at.toISOString());
    expect(new Date(updatedRegion.updatedAt).valueOf()).toBeGreaterThan(oldRegion!.updated_at.valueOf());
  });

  test('should change the number of pois', async () => {
    expect(updatedRegion.pois).toBeDefined();
    expect(updatedRegion.pois.length).toBe(3);
    const regionsPoints = await db().table('regions_points').count();
    const points = await db().table('points').count();
    const regionsPointsByRegion = await db().table('regions_points').where('region_id', updatedRegion.id).count();
    expect(regionsPoints[0].count).toBe('3');
    expect(points[0].count).toBe('3');
    expect(regionsPointsByRegion[0].count).toBe('3');
  });

  test('should delete POI', async () => {
    expect(updatedRegion.pois.map((p: PointRaw) => p.id)).not.toContain('573f995a-d55f-4faf-8f11-5a6016ab562f');
    const points = await db().table('points').where({ id: '573f995a-d55f-4faf-8f11-5a6016ab562f' }).count();
    const regionsPointsByRegion = await db().table('regions_points')
      .where({ point_id: '573f995a-d55f-4faf-8f11-5a6016ab562f' }).count();
    expect(points[0].count).toBe('0');
    expect(regionsPointsByRegion[0].count).toBe('0');
  });

  test('should insert pois', async () => {
    const points = await db().table('points_view').select('points_view.name')
      .innerJoin('regions_points', 'points_view.id', 'regions_points.point_id')
      .where('regions_points.region_id', updatedRegion.id)
      .where('language', 'en');
    expect(points.map((p: PointRaw) => p.name)).toEqual(expect.arrayContaining(['pt 1 u', 'pt 2 u']));
  });

  test('should update poi', async () => {
    const point = await db().table('points_view').select('name')
      .where({ id: 'd7530317-efac-44a7-92ff-8d045b2ac893', language: 'en' }).first();
    expect(point.name).toBe('r 1 p 2');
  });

  test('should match snapshot', () => {
    const snapshot: any = noTimestamps(updatedRegion);
    snapshot.pois = snapshot.pois.map(noUnstable);
    expect(snapshot).toMatchSnapshot();
  });
});

describe('i18n', () => {
  const emptyRegionRu = {
    id: '2caf75ca-7625-11e7-b5a5-be2e44b06b34',
    name: 'Пустой регион',
    description: null,
    bounds: [[10, 20, 0], [10, 10, 0], [20, 20, 0]],
    season: null,
    seasonNumeric: [],
    hidden: false,
    pois: [],
  };

  test('should add translation', async () => {
    const upsertResult = await runQuery(upsertQuery, { region: emptyRegionRu, language: 'ru' }, adminContext);
    expect(upsertResult.errors).toBeUndefined();
    const translation = await db().table('regions_translations').select()
      .where({ region_id: '2caf75ca-7625-11e7-b5a5-be2e44b06b34', language: 'ru' }).first();
    expect(translation.name).toBe('Пустой регион');
  });

  test('should modify common props when translation is added', async () => {
    const upsertResult = await runQuery(
      upsertQuery,
      { region: { ...emptyRegionRu, seasonNumeric: [10] }, language: 'ru' },
      adminContext,
    );
    expect(upsertResult.errors).toBeUndefined();
    const reg = await db().table('regions').select()
      .where({ id: '2caf75ca-7625-11e7-b5a5-be2e44b06b34' }).first();
    expect(reg.season_numeric).toEqual([10]);
  });

  test('should modify translation', async () => {
    const region = {
      id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34',
      hidden: false,
      seasonNumeric: [20, 21],
      bounds: [[-114, 46, 0], [-115, 46, 0], [-115, 47, 0], [-114, 47, 0]],
      name: 'Сменил имя',
      description: 'Сменил описание',
      season: 'осень осень',
      pois: [],
    };
    const upsertResult = await runQuery(upsertQuery, { region, language: 'ru' }, adminContext);
    expect(upsertResult.errors).toBeUndefined();
    const translation = await db().table('regions_translations').select()
      .where({ region_id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34', language: 'ru' }).first();
    expect(translation).toEqual(expect.objectContaining({
      name: 'Сменил имя',
      description: 'Сменил описание',
      season: 'осень осень',
    }));
  });

  test('should update poi translation', async () => {
    const region = {
      ...fullRegion,
      id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34',
      pois: [
        { id: null, name: 'Тчка 1', description: 'тчк 1 описание', kind: 'other', coordinates: [10, 12, 0] },
      ],
    };
    const upsertResult = await runQuery(upsertQuery, { region, language: 'ru' }, adminContext);
    expect(upsertResult.errors).toBeUndefined();
    const translation = await db().table('points_translations').select()
      .where({ language: 'ru' }).first();
    expect(translation).toEqual(expect.objectContaining({
      name: 'Тчка 1',
      description: 'тчк 1 описание',
    }));
    // Pois are shared between translations
    // changing number of pois in russian translations will affect number of pois in english translation
    const poiCount = await db().table('regions_points').select()
      .where({ region_id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34' })
      .count();
    expect(poiCount[0].count).toBe('1');
  });
});
