import db, { holdTransaction, rollbackTransaction } from '@db';
import { ADMIN, EDITOR_GA_EC, EDITOR_NO_EC, TEST_USER } from '@seeds/01_users';
import { GALICIA_PT_1, GALICIA_PT_2 } from '@seeds/02_points';
import { GROUP_ALL } from '@seeds/03_groups';
import { NUM_REGIONS, REGION_ECUADOR, REGION_GALICIA } from '@seeds/04_regions';
import {
  anonContext,
  countRows,
  fakeContext,
  isTimestamp,
  isUUID,
  noTimestamps,
  noUnstable,
  runQuery,
} from '@test';
import { ApolloErrorCodes, RegionInput } from '@whitewater-guide/commons';
import set from 'lodash/fp/set';
import { PointRaw } from '../../points';
import { RegionRaw } from '../types';

let rpBefore: number;
let pBefore: number;

beforeAll(async () => {
  [pBefore, rpBefore] = await countRows(true, 'points', 'regions_points');
});

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const minimalRegion: RegionInput = {
  id: null,
  name: 'Minimal region',
  description: null,
  bounds: [[10, 20, 0], [10, 10, 0], [20, 20, 0]],
  season: null,
  seasonNumeric: [],
  pois: [],
};

const fullRegion: RegionInput = {
  id: null,
  name: 'Full region',
  description: 'Full region description',
  bounds: [[10, 20, 0], [10, 10], [20, 20, null]],
  season: 'season description',
  seasonNumeric: [1, 2, 3],
  pois: [],
};

const fullRegionUpdate: RegionInput = {
  ...fullRegion,
  id: REGION_GALICIA,
  pois: [
    {
      id: null,
      name: 'pt 1 u',
      description: 'pt 1 upd',
      kind: 'other',
      coordinates: [10, 12, 0],
    }, // new
    {
      id: null,
      name: 'pt 2 u',
      description: 'pt 2 upd',
      kind: 'take-out',
      coordinates: [33, 34, null],
    }, // new
    {
      id: GALICIA_PT_2,
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
    {
      id: null,
      name: 'pt 1',
      description: 'pt 1 d',
      kind: 'other',
      coordinates: [10, 12], // 2d
    },
    {
      id: null,
      name: 'pt 2',
      description: 'pt 2 d',
      kind: 'take-out',
      coordinates: [33, 34, 0], // 3d
    },
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
  it('anon should not pass', async () => {
    const result = await runQuery(
      upsertQuery,
      { region: minimalRegion },
      anonContext(),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should not pass', async () => {
    const result = await runQuery(
      upsertQuery,
      { region: minimalRegion },
      fakeContext(TEST_USER),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editor should not create', async () => {
    const result = await runQuery(
      upsertQuery,
      { region: minimalRegion },
      fakeContext(EDITOR_GA_EC),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('non-owning editor should not edit', async () => {
    const result = await runQuery(
      upsertQuery,
      { region: fullRegionUpdate },
      fakeContext(EDITOR_NO_EC),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('should throw on invalid input', async () => {
    const invalidInput: RegionInput = {
      id: null,
      name: 'x',
      description: null,
      season: null,
      seasonNumeric: [55],
      bounds: [[300, 300, 300]],
      pois: [],
    };
    const result = await runQuery(
      upsertQuery,
      { region: invalidInput },
      fakeContext(EDITOR_GA_EC),
    );
    expect(result).toHaveGraphqlValidationError();
  });
});

describe('insert', () => {
  let insertResult: any;
  let insertedRegion: any;

  beforeEach(async () => {
    insertResult = await runQuery(
      upsertQuery,
      { region: fullRegionWithPOIs },
      fakeContext(ADMIN),
    );
    insertedRegion =
      insertResult && insertResult.data && insertResult.data.upsertRegion;
  });

  afterEach(() => {
    insertResult = null;
    insertedRegion = null;
  });

  it('should return result', async () => {
    expect(insertResult).not.toHaveGraphqlError();
    expect(insertResult.data!.upsertRegion).toBeDefined();
  });

  it('should add one more region', async () => {
    const [regions] = await countRows(false, 'regions');
    expect(regions).toBe(NUM_REGIONS + 1);
  });

  it('should return id', () => {
    expect(insertedRegion.id).toBeDefined();
    expect(isUUID(insertedRegion.id)).toBe(true);
  });

  it('should return timestamps', () => {
    expect(insertedRegion.createdAt).toBeDefined();
    expect(insertedRegion.updatedAt).toBeDefined();
    expect(isTimestamp(insertedRegion.createdAt)).toBe(true);
    expect(isTimestamp(insertedRegion.updatedAt)).toBe(true);
  });

  it('should return pois', () => {
    expect(insertedRegion.pois).toBeDefined();
    expect(insertedRegion.pois.length).toBe(2);
  });

  it('should insert POIs', async () => {
    const regionsPointsByRegion = await db()
      .table('regions_points')
      .where('region_id', insertedRegion.id)
      .count()
      .first();
    const [pAfter, rpAfter] = await countRows(
      false,
      'points',
      'regions_points',
    );
    expect([pAfter, rpAfter]).toEqual([pBefore + 2, rpBefore + 2]);
    expect(regionsPointsByRegion.count).toBe('2');
  });

  it('should match snapshot', () => {
    const snapshot: any = noUnstable(insertedRegion);
    snapshot.pois = snapshot.pois.map(noUnstable);
    expect(snapshot).toMatchSnapshot();
  });

  it('should add region to ALL_REGIONS group', async () => {
    const { count } = await db()
      .table('regions_groups')
      .where('region_id', insertedRegion.id)
      .andWhere('group_id', GROUP_ALL)
      .count()
      .first();
    expect(Number(count)).toBe(1);
  });
});

describe('update', () => {
  let oldRegion: RegionRaw | null;
  let updateResult: any;
  let updatedRegion: any;

  beforeEach(async () => {
    oldRegion = await db()
      .table('regions_view')
      .where({ id: fullRegionUpdate.id })
      .first();
    updateResult = await runQuery(
      upsertQuery,
      { region: fullRegionUpdate },
      fakeContext(EDITOR_GA_EC),
    );
    updatedRegion =
      updateResult && updateResult.data && updateResult.data.upsertRegion;
  });

  afterEach(() => {
    updateResult = null;
    updatedRegion = null;
  });

  it('should return result', () => {
    expect(updateResult).not.toHaveGraphqlError();
    expect(updateResult.data!.upsertRegion).toBeDefined();
  });

  it('should not change total number of regions', async () => {
    const [regions] = await countRows(false, 'regions');
    expect(regions).toBe(NUM_REGIONS);
  });

  it('should return id', () => {
    expect(updatedRegion.id).toBe(fullRegionUpdate.id);
  });

  it('should update updated_at timestamp', () => {
    expect(updatedRegion.createdAt).toBe(oldRegion!.created_at.toISOString());
    expect(new Date(updatedRegion.updatedAt).valueOf()).toBeGreaterThan(
      oldRegion!.updated_at.valueOf(),
    );
  });

  it('should change the number of pois', async () => {
    expect(updatedRegion.pois).toBeDefined();
    expect(updatedRegion.pois.length).toBe(3);
    const regionsPointsByRegion = await db()
      .table('regions_points')
      .where('region_id', updatedRegion.id)
      .count();
    const [pAfter, rpAfter] = await countRows(
      false,
      'points',
      'regions_points',
    );
    expect([pAfter, rpAfter]).toEqual([pBefore + 1, rpBefore + 1]);
    expect(regionsPointsByRegion[0].count).toBe('3');
  });

  it('should delete POI', async () => {
    expect(updatedRegion.pois.map((p: PointRaw) => p.id)).not.toContain(
      GALICIA_PT_1,
    );
    const points = await db()
      .table('points')
      .where({ id: GALICIA_PT_1 })
      .count();
    const regionsPointsByRegion = await db()
      .table('regions_points')
      .where({ point_id: GALICIA_PT_1 })
      .count();
    expect(points[0].count).toBe('0');
    expect(regionsPointsByRegion[0].count).toBe('0');
  });

  it('should insert pois', async () => {
    const points = await db()
      .table('points_view')
      .select('points_view.name')
      .innerJoin('regions_points', 'points_view.id', 'regions_points.point_id')
      .where('regions_points.region_id', updatedRegion.id)
      .where('language', 'en');
    expect(points.map((p: PointRaw) => p.name)).toEqual(
      expect.arrayContaining(['pt 1 u', 'pt 2 u']),
    );
  });

  it('should update poi', async () => {
    const point = await db()
      .table('points_view')
      .select('name')
      .where({ id: GALICIA_PT_2, language: 'en' })
      .first();
    expect(point.name).toBe('r 1 p 2');
  });

  it('should match snapshot', () => {
    const snapshot: any = noTimestamps(updatedRegion);
    snapshot.pois = snapshot.pois.map(noUnstable);
    expect(snapshot).toMatchSnapshot();
  });
});

describe('i18n', () => {
  const emptyRegionRu = {
    id: REGION_ECUADOR,
    name: 'Пустой регион',
    description: null,
    bounds: [[10, 20, 0], [10, 10, 0], [20, 20, 0]],
    season: null,
    seasonNumeric: [],
    pois: [],
  };

  it('should add translation', async () => {
    const upsertResult = await runQuery(
      upsertQuery,
      { region: emptyRegionRu },
      fakeContext(EDITOR_GA_EC, 'ru'),
    );
    expect(upsertResult.errors).toBeUndefined();
    const translation = await db()
      .table('regions_translations')
      .select()
      .where({
        region_id: '2caf75ca-7625-11e7-b5a5-be2e44b06b34',
        language: 'ru',
      })
      .first();
    expect(translation.name).toBe('Пустой регион');
  });

  it('should modify common props when translation is added', async () => {
    const upsertResult = await runQuery(
      upsertQuery,
      { region: { ...emptyRegionRu, seasonNumeric: [10] } },
      fakeContext(EDITOR_GA_EC, 'ru'),
    );
    expect(upsertResult.errors).toBeUndefined();
    const reg = await db()
      .table('regions')
      .select()
      .where({ id: '2caf75ca-7625-11e7-b5a5-be2e44b06b34' })
      .first();
    expect(reg.season_numeric).toEqual([10]);
  });

  it('should modify translation', async () => {
    const region = {
      id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34',
      seasonNumeric: [20, 21],
      bounds: [[-114, 46, 0], [-115, 46, 0], [-115, 47, 0], [-114, 47, 0]],
      name: 'Сменил имя',
      description: 'Сменил описание',
      season: 'осень осень',
      pois: [],
    };
    const upsertResult = await runQuery(
      upsertQuery,
      { region },
      fakeContext(EDITOR_GA_EC, 'ru'),
    );
    expect(upsertResult.errors).toBeUndefined();
    const translation = await db()
      .table('regions_translations')
      .select()
      .where({
        region_id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34',
        language: 'ru',
      })
      .first();
    expect(translation).toEqual(
      expect.objectContaining({
        name: 'Сменил имя',
        description: 'Сменил описание',
        season: 'осень осень',
      }),
    );
  });

  it('should update poi translation', async () => {
    const region = {
      ...fullRegion,
      id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34',
      pois: [
        {
          id: null,
          name: 'Тчка 1',
          description: 'тчк 1 описание',
          kind: 'other',
          coordinates: [10, 12, 0],
        },
      ],
    };
    const upsertResult = await runQuery(
      upsertQuery,
      { region },
      fakeContext(EDITOR_GA_EC, 'ru'),
    );
    expect(upsertResult.errors).toBeUndefined();
    const translation = await db()
      .table('points_translations')
      .select()
      .where({ language: 'ru' });
    expect(translation).toContainEqual(
      expect.objectContaining({
        name: 'Тчка 1',
        description: 'тчк 1 описание',
      }),
    );
    // Pois are shared between translations
    // changing number of pois in russian translations will affect number of pois in english translation
    const poiCount = await db()
      .table('regions_points')
      .select()
      .where({ region_id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34' })
      .count();
    expect(poiCount[0].count).toBe('1');
  });
});

it('should sanitize input', async () => {
  let dirtyRegion = {
    ...fullRegionWithPOIs,
    name: "it's a \\ $1 slash with . ?",
  };
  dirtyRegion = set('pois.0.name', "it's a poi", dirtyRegion);

  const insertResult = await runQuery(
    upsertQuery,
    { region: dirtyRegion },
    fakeContext(ADMIN),
  );
  expect(insertResult).not.toHaveGraphqlError();
  expect(insertResult).toHaveProperty(
    'data.upsertRegion.name',
    "it's a \\ $1 slash with . ?",
  );
  expect(insertResult).toHaveProperty(
    'data.upsertRegion.pois.0.name',
    "it's a poi",
  );
});
