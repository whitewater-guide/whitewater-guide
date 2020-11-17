import {
  copyToS3,
  copyToTemp,
  countRows,
  fakeContext,
  fileExistsInBucket,
  noUnstable,
  resetTestMinio,
  runQuery,
  UUID_REGEX,
} from '@test';
import {
  ApolloErrorCodes,
  Duration,
  MediaInput,
  MediaKind,
  NEW_ID,
  OTHERS_REGION_ID,
  SectionInput,
} from '@whitewater-guide/commons';
import { ExecutionResult } from 'graphql';
import set from 'lodash/fp/set';
import * as path from 'path';

import config from '~/config';
import db, { holdTransaction, rollbackTransaction } from '~/db';
import { SectionsEditLogRaw } from '~/features/sections';
import { MEDIA, TEMP } from '~/s3';
import {
  ADMIN,
  ADMIN_ID,
  EDITOR_GA_EC,
  EDITOR_GA_EC_ID,
  EDITOR_NO,
  EDITOR_NO_EC,
  EDITOR_NO_EC_ID,
  TEST_USER,
} from '~/seeds/test/01_users';
import { LOWER_BECA_PT_1 } from '~/seeds/test/02_points';
import { REGION_GALICIA, REGION_NORWAY } from '~/seeds/test/04_regions';
import { SOURCE_GALICIA_1, SOURCE_GEORGIA } from '~/seeds/test/05_sources';
import {
  GAUGE_GAL_1_1,
  GAUGE_GAL_1_2,
  GAUGE_GEO_1,
} from '~/seeds/test/06_gauges';
import {
  RIVER_BZHUZHA,
  RIVER_GAL_BECA,
  RIVER_GAL_CABE,
  RIVER_QUIJOS,
  RIVER_SJOA,
} from '~/seeds/test/07_rivers';
import {
  GALICIA_BECA_LOWER,
  GEORGIA_BZHUZHA_QUALI,
  NORWAY_SJOA_AMOT,
} from '~/seeds/test/09_sections';
import { PHOTO_1, PHOTO_2 } from '~/seeds/test/11_media';

jest.mock('../../gorge/connector');

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

beforeEach(async () => {
  jest.resetAllMocks();
  await holdTransaction();
  await resetTestMinio();
});
afterEach(rollbackTransaction);
afterAll(() => resetTestMinio(true));

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
      helpNeeded
      verified
      demo
      pois {
        id
        name
        coordinates
      }
      media {
        nodes {
          id
          kind
          url
        }
        count
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

  shape: [
    [33, 33],
    [34, 42, 0],
    [34, 43, null],
  ],
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
      coordinates: [10, 12, 0], // 3d
    },
    {
      id: null,
      name: 'playrun pt 2',
      description: 'pt 2 d',
      kind: 'portage',
      coordinates: [33, 34], // 2d
    },
  ],
  media: [],
  hidden: false,
  helpNeeded: 'please proofread this',
};

const newRiverSection = {
  ...existingRiverSection,
  river: { id: NEW_ID, name: 'Rauma' },
  region: { id: REGION_NORWAY },
};

const updateData: SectionInput = {
  ...existingRiverSection,
  id: GALICIA_BECA_LOWER, // galician river 1 section 1
  river: {
    id: RIVER_GAL_BECA,
  },
  gauge: {
    id: GAUGE_GAL_1_1, // Galicia gauge 1
  },
  // Seed section has 2 POIS
  // Delete 1 POI, update 1 poi, add 2 POIs
  pois: [
    {
      id: LOWER_BECA_PT_1,
      name: 'Updated poi name',
      description: 'Updated poi description ', // was 'Some rapid',
      kind: 'other', // was rapid
      coordinates: [2.1, 2.3, 3.4], // was [1.2, 3.2, 4.3]
    },
    {
      id: null,
      name: 'Updated new poi 1 name',
      description: 'Updated new poi 1 description',
      kind: 'portage',
      coordinates: [66, 77, null],
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
  helpNeeded: 'fix take-out',
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

  shape: [
    [300, 33, 0],
    [34, 42, 0],
  ],
  distance: -2.44,
  drop: -101.1,
  duration: 4,
  difficulty: 33,
  difficultyXtra: null,
  rating: 35,
  tags: [],
  pois: [],
  media: [],

  hidden: false,
  helpNeeded: null,
};

it('should fail on invalid input', async () => {
  const result = await runQuery(
    upsertQuery,
    { section: invalidSection },
    fakeContext(ADMIN),
  );
  expect(result).toHaveGraphqlValidationError();
});

it('anon should not create suggestion', async () => {
  const result = await runQuery(upsertQuery, { section: newRiverSection });
  expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
});

it.each([
  ['user', 'unverified', false, TEST_USER],
  ['non-owning editor', 'unverified', false, EDITOR_GA_EC],
  ['editor', 'verified', true, EDITOR_NO],
  ['admin', 'verified', true, ADMIN],
])('%s should create %s section', async (_, __, verified, user) => {
  const result = await runQuery(
    upsertQuery,
    { section: newRiverSection },
    fakeContext(user),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data.upsertSection.verified).toEqual(verified);
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
    expect(noUnstable(insertedSection)).toMatchSnapshot();
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
      section_name: existingRiverSection.name,
      river_id: existingRiverSection.river.id,
      river_name: 'Sjoa',
      region_id: REGION_NORWAY,
      region_name: 'Norway',
      editor_id: EDITOR_NO_EC_ID,
      action: 'create',
      diff: null,
      created_at: expect.any(Date),
    });
  });
});

describe('insert with new river', () => {
  let insertResult: any;
  let insertedSection: any;

  beforeEach(async () => {
    insertResult = await runQuery(
      upsertQuery,
      {
        section: newRiverSection,
      },
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
    expect(insertedSection).toMatchObject({
      river: {
        id: expect.stringMatching(UUID_REGEX),
        name: 'Rauma',
      },
    });
  });

  it('should insert into tables', async () => {
    const [sections, rivers] = await countRows(false, 'sections', 'rivers');
    expect(sections - sBefore).toBe(1);
    expect(rivers - rBefore).toBe(1);
  });
});

it('should create river in others region when region is not provided', async () => {
  const { region: _, ...section } = newRiverSection;
  const result = await runQuery(
    upsertQuery,
    { section },
    fakeContext(TEST_USER),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data.upsertSection).toMatchObject({
    river: {
      id: expect.stringMatching(UUID_REGEX),
      name: 'Rauma',
    },
    region: {
      id: OTHERS_REGION_ID,
    },
  });
});

it.each([
  ['anon', 'not ', ApolloErrorCodes.UNAUTHENTICATED, undefined],
  ['user', 'not ', ApolloErrorCodes.FORBIDDEN, TEST_USER],
  ['non-owning editor', 'not ', ApolloErrorCodes.FORBIDDEN, EDITOR_NO],
  ['editor', '', undefined, EDITOR_GA_EC],
  ['admin', '', undefined, ADMIN],
])('%s should %supdate section', async (_, __, error, user) => {
  const result = await runQuery(
    upsertQuery,
    { section: updateData },
    fakeContext(user),
  );
  if (error) {
    expect(result).toHaveGraphqlError(error);
  } else {
    expect(result.errors).toBeUndefined();
  }
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
    expect(noUnstable(updatedSection)).toMatchSnapshot();
  });

  it('should change section from unverfied to verified when editing it', async () => {
    expect(updatedSection.verified).toBe(true);
  });

  it('should not change total number of sections', async () => {
    const [sections] = await countRows(false, 'sections');
    expect(sections - sBefore).toBe(0);
  });

  it('should not change total number of rivers', async () => {
    const [rivers] = await countRows(false, 'rivers');
    expect(rivers - rBefore).toBe(0);
  });

  it('should increase updated_at timestamp', async () => {
    const { created_at, updated_at } = await db()
      .table('sections_view')
      .where({ id: updateData.id })
      .first();
    expect(created_at).toEqual(originalSection!.created_at);
    expect(updated_at > originalSection!.updated_at).toBe(true);
  });

  it('should change the number of pois', async () => {
    expect(oldPoiIds).toHaveLength(2);
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
      .where({ id: LOWER_BECA_PT_1, language: 'en' })
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
      section_name: updateData.name,
      river_id: updateData.river.id,
      river_name: 'Beca',
      region_id: REGION_GALICIA,
      region_name: 'Galicia',
      editor_id: EDITOR_GA_EC_ID,
      action: 'update',
      diff: expect.any(Object),
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
    shape: [
      [1, 1, 0],
      [2, 2, 0],
    ],
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
    media: [],

    hidden: false,
    helpNeeded: null,
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
          id: LOWER_BECA_PT_1,
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

describe('media', () => {
  const media: MediaInput[] = [
    {
      id: null,
      description: 'photo description',
      copyright: 'photo copyright',
      url: 'photo.jpg',
      kind: MediaKind.photo,
      resolution: [100, 100],
      weight: null,
    },
    {
      id: null,
      description: 'video description',
      copyright: 'video copyright',
      url: 'https://www.youtube.com/watch?v=FRmz0QQXHEw',
      kind: MediaKind.video,
      resolution: null,
      weight: null,
    },
  ];
  const insertSection: SectionInput = {
    ...existingRiverSection,
    media,
  };
  const updateSection: SectionInput = {
    ...existingRiverSection,
    id: NORWAY_SJOA_AMOT,
    media: [
      ...media,
      {
        id: PHOTO_2,
        kind: MediaKind.photo,
        description: 'Photo 2 new description',
        copyright: 'Photo 2 new copyright',
        // Absolute url of photo that exists in seed minio data
        url: `${config.contentPublicURL}/${PHOTO_2}`,
        resolution: [1024, 768],
        weight: 1,
      },
    ],
  };

  beforeEach(async () => {
    await copyToTemp(
      path.resolve(__dirname, '__tests__/test.jpg'),
      'photo.jpg',
    );
    await copyToS3(
      MEDIA,
      path.resolve(__dirname, '__tests__/test.jpg'),
      'media_suggestion1.jpg',
    );
  });

  describe('insert', () => {
    let result!: ExecutionResult;

    beforeEach(async () => {
      result = await runQuery(
        upsertQuery,
        { section: insertSection },
        fakeContext(EDITOR_NO_EC),
      );
    });

    it('should return media', () => {
      expect(result.errors).toBeUndefined();
      expect(result.data!.upsertSection.media).toMatchObject({
        count: 2,
        nodes: [
          {
            id: expect.stringMatching(UUID_REGEX),
            url: 'imgproxy://media/photo.jpg',
            kind: MediaKind.photo,
          },
          {
            id: expect.stringMatching(UUID_REGEX),
            url: 'https://www.youtube.com/watch?v=FRmz0QQXHEw',
            kind: MediaKind.video,
          },
        ],
      });
    });

    it('should move photos from temp dir', async () => {
      await expect(fileExistsInBucket(TEMP, 'test.jpg')).resolves.toBe(false);
      await expect(fileExistsInBucket(TEMP, 'photo.jpg')).resolves.toBe(false);
      // expect items bucket to contain new_image.jpg
      await expect(
        fileExistsInBucket(
          MEDIA,
          'photo.jpg',
          '11ad66ff24bc4d463dfe8219f6ba6bcd',
        ),
      ).resolves.toBe(true);
    });
  });

  describe('update', () => {
    let result!: ExecutionResult;

    beforeEach(async () => {
      result = await runQuery(
        upsertQuery,
        { section: updateSection },
        fakeContext(EDITOR_NO_EC),
      );
    });

    it('should return media', () => {
      expect(result.errors).toBeUndefined();
      expect(result.data!.upsertSection.media).toMatchObject({
        count: 3,
        nodes: [
          {
            id: PHOTO_2,
            url: `imgproxy://media/${PHOTO_2}`,
            kind: MediaKind.photo,
          },
          {
            id: expect.stringMatching(UUID_REGEX),
            url: 'imgproxy://media/photo.jpg',
            kind: MediaKind.photo,
          },
          {
            id: expect.stringMatching(UUID_REGEX),
            url: 'https://www.youtube.com/watch?v=FRmz0QQXHEw',
            kind: MediaKind.video,
          },
        ],
      });
    });

    it('update should delete existing media', async () => {
      const old = await db(false)
        .select('*')
        .from('media')
        .where({ id: PHOTO_1 });
      expect(old).toEqual([]);
    });

    it('should delete unused media files', async () => {
      await expect(fileExistsInBucket(MEDIA, PHOTO_1)).resolves.toBe(false);
    });
  });
});

describe('gorge jobs', () => {
  let spy: jest.Mock;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    spy = require('../../gorge/connector').mockUpdateJobForSource;
  });

  it('should update job for new section with gauge', async () => {
    const result = await runQuery(
      upsertQuery,
      {
        section: {
          ...existingRiverSection,
          river: { id: RIVER_GAL_BECA },
          gauge: { id: GAUGE_GAL_1_1 },
        },
      },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(spy).toHaveBeenCalledWith(SOURCE_GALICIA_1);
  });

  it('should not update job for new section without gauge', async () => {
    const result = await runQuery(
      upsertQuery,
      {
        section: {
          ...existingRiverSection,
          river: { id: RIVER_GAL_BECA },
          gauge: null,
        },
      },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not update job when section is updated without gauge change', async () => {
    const result = await runQuery(
      upsertQuery,
      { section: updateData },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should update job when section is updated with gauge change', async () => {
    const result = await runQuery(
      upsertQuery,
      { section: { ...updateData, gauge: { id: GAUGE_GAL_1_2 } } },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(spy).toHaveBeenCalledWith(SOURCE_GALICIA_1);
  });

  it('should update two jobs gauge from different source is selected', async () => {
    const result = await runQuery(
      upsertQuery,
      { section: { ...updateData, gauge: { id: GAUGE_GEO_1 } } },
      fakeContext(ADMIN),
    );
    expect(result.errors).toBeUndefined();
    expect(spy).toHaveBeenCalledWith(SOURCE_GALICIA_1);
    expect(spy).toHaveBeenCalledWith(SOURCE_GEORGIA);
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

it('should be able to change river of existing section', async () => {
  const res = await runQuery(
    upsertQuery,
    { section: { ...updateData, river: { id: RIVER_GAL_CABE } } },
    fakeContext(EDITOR_GA_EC),
  );
  expect(res.errors).toBeUndefined();
  expect(res.data.upsertSection.river.id).toBe(RIVER_GAL_CABE);
});

describe('demo sections', () => {
  it('new section should not be demo when created by editor in premium region', async () => {
    const res = await runQuery(
      upsertQuery,
      { section: { ...updateData, id: null, river: { id: RIVER_QUIJOS } } },
      fakeContext(EDITOR_GA_EC),
    );
    expect(res.errors).toBeUndefined();
    expect(res.data.upsertSection.demo).toBe(false);
  });

  it('new section should be demo when created by non-editor in premium region', async () => {
    const res = await runQuery(
      upsertQuery,
      { section: { ...updateData, id: null, river: { id: RIVER_QUIJOS } } },
      fakeContext(TEST_USER),
    );
    expect(res.errors).toBeUndefined();
    expect(res.data.upsertSection.demo).toBe(true);
  });

  it('new section should not be demo when created by editor in free region', async () => {
    const res = await runQuery(
      upsertQuery,
      { section: { ...updateData, id: null, river: { id: RIVER_GAL_CABE } } },
      fakeContext(EDITOR_GA_EC),
    );
    expect(res.errors).toBeUndefined();
    expect(res.data.upsertSection.demo).toBe(false);
  });

  it('new section should not be demo when created by non-editor in free region', async () => {
    const res = await runQuery(
      upsertQuery,
      { section: { ...updateData, id: null, river: { id: RIVER_GAL_CABE } } },
      fakeContext(TEST_USER),
    );
    expect(res.errors).toBeUndefined();
    expect(res.data.upsertSection.demo).toBe(false);
  });

  // issue #460
  it('in premium region should stay demo after edit', async () => {
    const data = {
      ...updateData,
      id: GEORGIA_BZHUZHA_QUALI,
      river: {
        id: RIVER_BZHUZHA,
      },
      gauge: null,
    };
    const res = await runQuery(
      upsertQuery,
      { section: data },
      fakeContext(ADMIN),
    );
    expect(res.errors).toBeUndefined();
    expect(res.data.upsertSection.demo).toBe(true);
  });
});
