import db, { holdTransaction, rollbackTransaction } from '@db';
import { SectionsEditLogRaw } from '@features/sections';
import {
  ADMIN,
  ADMIN_ID,
  EDITOR_GA_EC,
  EDITOR_GA_EC_ID,
  EDITOR_NO_EC,
  EDITOR_NO_EC_ID,
  TEST_USER,
} from '@seeds/01_users';
import { REGION_GALICIA, REGION_NORWAY } from '@seeds/04_regions';
import { RIVER_GAL_1, RIVER_SJOA } from '@seeds/07_rivers';
import { GALICIA_R1_S1, NORWAY_SJOA_AMOT } from '@seeds/09_sections';
import {
  anonContext,
  countRows,
  fakeContext,
  noUnstable,
  runQuery,
  UUID_REGEX,
} from '@test';
import {
  ApolloErrorCodes,
  Duration,
  SectionInput,
} from '@whitewater-guide/commons';
import set from 'lodash/fp/set';

let spBefore: number;
let pBefore: number;
let rBefore: number;
let sBefore: number;
let tBefore: number;

beforeAll(async () => {
  [spBefore, pBefore, rBefore, sBefore, tBefore] = await countRows(
    true,
    'sections_points',
    'points',
    'rivers',
    'sections',
    'sections_tags',
  );
});

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const upsertQuery = `
  mutation upsertSection($section: SectionInput!){
    upsertSection(section: $section){
      id
      name
      description
      season
      seasonNumeric
      region {
        id
        name
      }
      river {
        id
        name
      }
      gauge {
        id
        name
      }
      levels {
        minimum
        optimum
        maximum
        impossible
        approximate
      }
      flows {
        minimum
        optimum
        maximum
        impossible
        approximate
      }
      flowsText
      putIn {
        id
        name
        coordinates
      }
      takeOut {
        id
        name
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
      hidden
      pois {
        id
        name
        coordinates
      }
    }
  }
`;

const existingRiverSection: SectionInput = {
  id: null,
  name: 'Playrun',
  altNames: null,
  description: 'Playrun description',
  season: 'Playrun season',
  seasonNumeric: [1, 2, 3],
  river: {
    id: RIVER_SJOA,
  },
  gauge: {
    id: 'c03184b4-aaa0-11e7-abc4-cec278b6b50a',
  },
  levels: {
    minimum: 100,
    optimum: null,
    maximum: null,
    impossible: null,
    approximate: false,
  },
  flows: null,
  flowsText: 'Playrun flows',

  shape: [[33, 33, 0], [34, 42, 0]],
  distance: 2.44,
  drop: 101.1,
  duration: Duration.LAPS,
  difficulty: 4,
  difficultyXtra: 'X',
  rating: 5,
  tags: [{ id: 'waterfalls' }, { id: 'undercuts' }],
  pois: [
    {
      id: null,
      name: 'playrun pt 1',
      description: 'pt 1 d',
      kind: 'other',
      coordinates: [10, 12, 0],
    },
    {
      id: null,
      name: 'playrun pt 2',
      description: 'pt 2 d',
      kind: 'portage',
      coordinates: [33, 34, 0],
    },
  ],
  hidden: false,
};

const updateData: SectionInput = {
  ...existingRiverSection,
  id: GALICIA_R1_S1, // galician river 1 section 1
  river: {
    id: RIVER_GAL_1,
  },
  gauge: {
    id: 'aba8c106-aaa0-11e7-abc4-cec278b6b50a', // Galicia gauge 1
  },
  // Seed section has 2 POIS
  // Delete 1 POI, update 1 poi, add 2 POIs
  pois: [
    {
      id: 'ca0bee06-d445-11e7-9296-cec278b6b50a',
      name: 'Updated poi name', // was 'Galicia Riv 1 Sec 1 Rapid',
      description: 'Updated poi description ', // was 'Some rapid',
      kind: 'other', // was rapid
      coordinates: [2.1, 2.3, 3.4], // was [1.2, 3.2, 4.3]
    },
    {
      id: null,
      name: 'Updated new poi 1 name',
      description: 'Updated new poi 1 description',
      kind: 'portage',
      coordinates: [66, 77, 88],
    },
    {
      id: null,
      name: 'Updated new poi 2 name',
      description: 'Updated new poi 2 description',
      kind: 'other',
      coordinates: [50.1, 50.2, 333],
    },
  ],
  // Delete one tag, add two new tags, keep one old
  tags: [{ id: 'creeking' }, { id: 'undercuts' }, { id: 'snowmelt' }],
};

const invalidSection: SectionInput = {
  id: null,
  name: 'z',
  altNames: ['x'],
  description: null,
  season: null,
  seasonNumeric: [300, 2, 3],
  river: {
    id: RIVER_SJOA,
  },
  gauge: null,
  levels: null,
  flows: null,
  flowsText: null,

  shape: [[300, 33, 0], [34, 42, 0]],
  distance: -2.44,
  drop: -101.1,
  duration: 4,
  difficulty: 33,
  difficultyXtra: null,
  rating: 35,
  tags: [],
  pois: [],

  hidden: false,
};

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await runQuery(
      upsertQuery,
      { section: existingRiverSection },
      anonContext(),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should not pass', async () => {
    const result = await runQuery(
      upsertQuery,
      { section: existingRiverSection },
      fakeContext(TEST_USER),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('non-owning editor should not pass', async () => {
    const result = await runQuery(
      upsertQuery,
      { section: existingRiverSection },
      fakeContext(EDITOR_GA_EC),
    );
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('should fail on invalid input', async () => {
    const result = await runQuery(
      upsertQuery,
      { section: invalidSection },
      fakeContext(ADMIN),
    );
    expect(result).toHaveGraphqlValidationError();
  });
});

describe('insert', () => {
  let insertResult: any;
  let insertedSection: any;

  beforeEach(async () => {
    insertResult = await runQuery(
      upsertQuery,
      { section: existingRiverSection },
      fakeContext(EDITOR_NO_EC),
    );
    insertedSection =
      insertResult && insertResult.data && insertResult.data.upsertSection;
  });

  afterEach(() => {
    insertResult = null;
    insertedSection = null;
  });

  it('should return result', () => {
    expect(insertResult.errors).toBeUndefined();
    expect(noUnstable(insertResult)).toMatchSnapshot();
  });

  it('should insert into tables', async () => {
    const [sections] = await countRows(false, 'sections');
    expect(sections - sBefore).toBe(1);
  });

  it('should not change total number of rivers', async () => {
    const [rivers] = await countRows(false, 'rivers');
    expect(rivers - rBefore).toBe(0);
  });

  it('should insert pois', async () => {
    const [spAfter, pAfter] = await countRows(
      false,
      'sections_points',
      'points',
    );
    expect([spAfter - spBefore, pAfter - pBefore]).toEqual([2, 2]);
  });

  it('should insert tags', async () => {
    const [tags] = await countRows(false, 'sections_tags');
    expect(tags - tBefore).toBe(2);
  });

  it('should correctly set created_by', async () => {
    const { created_by } = await db()
      .table('sections')
      .select(['created_by'])
      .where({ id: insertedSection.id })
      .first();
    expect(created_by).toBe(EDITOR_NO_EC_ID);
  });

  it('should log this event', async () => {
    const entry: SectionsEditLogRaw = await db(false)
      .table('sections_edit_log')
      .orderBy('created_at', 'desc')
      .select('*')
      .first();
    expect(entry).toMatchObject({
      id: expect.stringMatching(UUID_REGEX),
      section_id: insertedSection.id,
      old_section_name: existingRiverSection.name,
      new_section_name: existingRiverSection.name,
      river_id: existingRiverSection.river.id,
      river_name: 'Sjoa',
      region_id: REGION_NORWAY,
      region_name: 'Norway',
      editor_id: EDITOR_NO_EC_ID,
      action: 'create',
      created_at: expect.any(Date),
    });
  });
});

describe('update', () => {
  let updateResult: any;
  let updatedSection: any;
  let originalSection: any;
  let oldPoiIds: any;

  beforeAll(async () => {
    originalSection = await db(true)
      .table('sections_view')
      .where({ id: updateData.id })
      .first();
    oldPoiIds = originalSection.pois.map((poi: any) => poi.id);
    expect(oldPoiIds).toHaveLength(2);
  });

  beforeEach(async () => {
    updateResult = await runQuery(
      upsertQuery,
      { section: updateData },
      fakeContext(EDITOR_GA_EC),
    );
    updatedSection =
      updateResult && updateResult.data && updateResult.data.upsertSection;
  });

  afterEach(() => {
    updateResult = null;
    updatedSection = null;
  });

  it('should return result', async () => {
    expect(updateResult.errors).toBeUndefined();
    expect(updatedSection.id).toBe(updateData.id);
    expect(noUnstable(updateResult)).toMatchSnapshot();
  });

  it('should not change total number of sections', async () => {
    const [sections] = await countRows(false, 'sections');
    expect(sections - sBefore).toBe(0);
  });

  it('should not change total number of rivers', async () => {
    const [rivers] = await countRows(false, 'rivers');
    expect(rivers - rBefore).toBe(0);
  });

  it('should increase updated_at timestamp', () => {
    expect(updatedSection.createdAt).toBe(
      originalSection!.created_at.toISOString(),
    );
    expect(new Date(updatedSection.updatedAt).valueOf()).toBeGreaterThan(
      originalSection!.updated_at.valueOf(),
    );
  });

  it('should change the number of pois', async () => {
    const [spAfter, pAfter] = await countRows(
      false,
      'sections_points',
      'points',
    );
    expect([spAfter - spBefore, pAfter - pBefore]).toEqual([1, 1]);
  });

  it('should delete POI', async () => {
    const sp = await db()
      .table('sections_points')
      .whereIn('point_id', oldPoiIds)
      .count()
      .first();
    expect(Number(sp.count)).toBe(1);
    const p = await db()
      .table('points')
      .whereIn('id', oldPoiIds)
      .count()
      .first();
    expect(Number(p.count)).toBe(1);
  });

  it('should insert pois', async () => {
    const sp = await db()
      .table('sections_points')
      .where({ section_id: updateData.id })
      .whereNotIn('point_id', oldPoiIds)
      .count()
      .first();
    expect(Number(sp.count)).toBe(2);
  });

  it('should update poi', async () => {
    const point = await db()
      .table('points_view')
      .select('name')
      .where({ id: 'ca0bee06-d445-11e7-9296-cec278b6b50a', language: 'en' })
      .first();
    expect(point.name).toBe('Updated poi name');
  });

  it('should change number of tags', async () => {
    const [tags] = await countRows(false, 'sections_tags');
    expect(tags - tBefore).toBe(1);
  });

  it('should not modify created_by', async () => {
    const { created_by } = await db()
      .table('sections')
      .select(['created_by'])
      .where({ id: updatedSection.id })
      .first();
    expect(created_by).toBe(ADMIN_ID);
  });

  it('should log this event', async () => {
    const entry: SectionsEditLogRaw = await db(false)
      .table('sections_edit_log')
      .orderBy('created_at', 'desc')
      .select('*')
      .first();
    expect(entry).toMatchObject({
      id: expect.stringMatching(UUID_REGEX),
      section_id: updateData.id,
      old_section_name: 'Gal_riv_1_sec_1',
      new_section_name: updateData.name,
      river_id: updateData.river.id,
      river_name: 'Gal_Riv_One',
      region_id: REGION_GALICIA,
      region_name: 'Galicia',
      editor_id: EDITOR_GA_EC_ID,
      action: 'update',
      created_at: expect.any(Date),
    });
  });
});

describe('i18n', () => {
  const amotFr: SectionInput = {
    id: NORWAY_SJOA_AMOT,
    name: 'Amot FR',
    altNames: ['Le Amot'],
    river: {
      id: RIVER_SJOA,
    },
    seasonNumeric: [10, 11, 12, 13, 14, 15, 16],
    shape: [[1, 1, 0], [2, 2, 0]],
    distance: 3.2,
    drop: 34.2,
    duration: Duration.LAPS,
    difficulty: 4,
    rating: 1,
    description: 'Amot description FR',
    season: 'Amot season FR',
    flowsText: 'Amot flows FR',
    difficultyXtra: null,
    flows: null,
    pois: [],
    gauge: null,
    levels: null,
    tags: [],

    hidden: false,
  };

  it('should add translation', async () => {
    const upsertResult = await runQuery(
      upsertQuery,
      { section: amotFr },
      fakeContext(EDITOR_NO_EC, 'fr'),
    );
    expect(upsertResult.errors).toBeUndefined();
    const translation = await db()
      .table('sections_translations')
      .select()
      .where({ section_id: amotFr.id, language: 'fr' })
      .first();
    expect(translation.name).toBe('Amot FR');
  });

  it('should modify common props when translation is added', async () => {
    const upsertResult = await runQuery(
      upsertQuery,
      { section: amotFr },
      fakeContext(EDITOR_NO_EC, 'fr'),
    );
    expect(upsertResult.errors).toBeUndefined();
    const section = await db()
      .table('sections')
      .select()
      .where({ id: amotFr.id })
      .first();
    expect(section.rating).toBe(1);
  });

  it('should modify translation', async () => {
    const upsertResult = await runQuery(
      upsertQuery,
      { section: amotFr },
      fakeContext(EDITOR_NO_EC, 'ru'),
    );
    expect(upsertResult.errors).toBeUndefined();
    const translation = await db()
      .table('sections_translations')
      .select()
      .where({ section_id: amotFr.id, language: 'ru' })
      .first();
    expect(translation).toEqual(
      expect.objectContaining({
        description: 'Amot description FR',
        season: 'Amot season FR',
        flows_text: 'Amot flows FR',
      }),
    );
  });

  it('should update poi translation', async () => {
    const updateRu = {
      ...updateData,
      pois: [
        {
          id: 'ca0bee06-d445-11e7-9296-cec278b6b50a',
          name: 'Русской имя', // was 'Galicia Riv 1 Sec 1 Rapid',
          description: 'Русское описание ', // was 'Some rapid',
          kind: 'other', // was rapid
          coordinates: [2.1, 2.3, 3.4], // was [1.2, 3.2, 4.3]
        },
      ],
    };
    const upsertResult = await runQuery(
      upsertQuery,
      { section: updateRu },
      fakeContext(EDITOR_GA_EC, 'ru'),
    );
    expect(upsertResult.errors).toBeUndefined();
    const translation = await db()
      .table('points_translations')
      .select()
      .where({ language: 'ru', point_id: updateRu.pois[0].id })
      .first();
    expect(translation).toEqual(
      expect.objectContaining({
        name: 'Русской имя',
        description: 'Русское описание ',
      }),
    );
  });
});

it('should sanitize input', async () => {
  let dirty = { ...existingRiverSection, name: "it's a \\ $1 slash with . ?" };
  dirty = set('pois.0.name', "it's a \\ $1 slash with . ?", dirty);
  const result = await runQuery(
    upsertQuery,
    { section: dirty },
    fakeContext(ADMIN),
  );
  expect(result).toHaveProperty(
    'data.upsertSection.name',
    "it's a \\ $1 slash with . ?",
  );
  expect(result).toHaveProperty(
    'data.upsertSection.pois.0.name',
    "it's a \\ $1 slash with . ?",
  );
});
