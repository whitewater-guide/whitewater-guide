import db, { holdTransaction, rollbackTransaction } from '../../../db';
import { adminContext, anonContext, userContext } from '../../../test/context';
import { noUnstable, runQuery } from '../../../test/db-helpers';
import { Duration, SectionInput } from '../../../ww-commons/features/sections/types';

let sectionsPointsBefore: number;
let pointsBefore: number;
let riversBefore: number;
let sectionsBefore: number;

beforeAll(async () => {
  const rp = await db(true).table('sections_points').count().first();
  sectionsPointsBefore = Number(rp.count);
  const points = await db(true).table('points').count().first();
  pointsBefore = Number(points.count);
  const rivers = await db(true).table('rivers').count().first();
  riversBefore = Number(rivers.count);
  const sections = await db(true).table('sections').count().first();
  sectionsBefore = Number(sections.count);
});

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const upsertQuery = `
  mutation upsertSection($section: SectionInput!, $language: String){
    upsertSection(section: $section, language: $language){
      id
      language
      name
      description
      season
      seasonNumeric
      region {
        id
        language
        name
      }
      river {
        id
        language
        name
      }
      gauge {
        id
        language
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
        language
        coordinates
      }
      takeOut {
        id
        name
        language
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
        name
        language
        coordinates
      }
    }
  }
`;

const existingRiverSection: SectionInput = {
  id: null,
  name: 'Playrun',
  description: 'Playrun description',
  season: 'Playrun season',
  seasonNumeric: [1, 2, 3],
  river: {
    id: 'd4396dac-d528-11e7-9296-cec278b6b50a',
    name: 'Sjoa',
    region: {
      id: 'b968e2b2-76c5-11e7-b5a5-be2e44b06b34',
    },
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
    { id: null, name: 'playrun pt 1', description: 'pt 1 d', kind: 'other', coordinates: [10, 12, 0] },
    { id: null, name: 'playrun pt 2', description: 'pt 2 d', kind: 'portage', coordinates: [33, 34, 0] },
  ],
};

const newRiverSection: SectionInput = {
  ...existingRiverSection,
  river: {
    id: null,
    name: 'Ula',
    region: {
      id: 'b968e2b2-76c5-11e7-b5a5-be2e44b06b34',
    },
  },
};

const updateData: SectionInput = {
  ...existingRiverSection,
  id: '2b01742c-d443-11e7-9296-cec278b6b50a', // galician river 1 section 1
  river: {
    id: 'a8416664-bfe3-11e7-abc4-cec278b6b50a',
    name: 'Gal_Riv_One',
    region: {
      id: 'bd3e10b6-7624-11e7-b5a5-be2e44b06b34',
    },
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
};

const invalidSection: SectionInput = {
  id: null,
  name: 'z',
  description: null,
  season: null,
  seasonNumeric: [300, 2, 3],
  river: {
    id: 'd4396dac-d528-11e7-9296-cec278b6b50a',
    name: 'Sjoa',
    region: {
      id: 'b968e2b2-76c5-11e7-b5a5-be2e44b06b34',
    },
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
};

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await runQuery(upsertQuery, { section: existingRiverSection }, anonContext);
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.upsertSection', null);
  });

  it('user should not pass', async () => {
    const result = await runQuery(upsertQuery, { section: existingRiverSection }, userContext);
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.upsertSection', null);
  });

  it('should fail on invalid input', async () => {
    const result = await runQuery(upsertQuery, { section: invalidSection }, adminContext);
    expect(result).toHaveProperty('errors.0.name', 'ValidationError');
    expect(result.data).toBeDefined();
    expect(result.data!.upsertSection).toBeNull();
    expect((result.errors![0] as any).data).toMatchSnapshot();
  });
});

describe('insert', () => {
  describe('existing river', () => {
    let insertResult: any;
    let insertedSection: any;

    beforeEach(async () => {
      insertResult = await runQuery(upsertQuery, { section: existingRiverSection }, adminContext);
      insertedSection = insertResult && insertResult.data && insertResult.data.upsertSection;
    });

    afterEach(() => {
      insertResult = null;
      insertedSection = null;
    });

    it('should return result', () => {
      expect(insertResult.errors).toBeUndefined();
      expect(noUnstable(insertResult)).toMatchSnapshot();
    });

    it('should increase total number of sections', async () => {
      const sections = await db().table('sections').count().first();
      expect(Number(sections.count) - sectionsBefore).toBe(1);
    });

    it('should not change total number of rivers', async () => {
      const rivers = await db().table('rivers').count().first();
      expect(Number(rivers.count) - riversBefore).toBe(0);
    });

    it('should insert pois', async () => {
      const rp = await db().table('sections_points').count().first();
      expect(Number(rp.count) - sectionsPointsBefore).toBe(2);
      const points = await db().table('points').count().first();
      expect(Number(points.count) - pointsBefore).toBe(2);
    });
  });

  describe('new river', () => {
    let insertResult: any;
    let insertedSection: any;

    beforeEach(async () => {
      insertResult = await runQuery(upsertQuery, { section: newRiverSection }, adminContext);
      insertedSection = insertResult && insertResult.data && insertResult.data.upsertSection;
    });

    afterEach(() => {
      insertResult = null;
      insertedSection = null;
    });

    it('should return result', async () => {
      expect(insertResult.errors).toBeUndefined();
      expect(noUnstable(insertResult)).toMatchSnapshot();
    });

    it('should create new river', async () => {
      const rivers = await db().table('rivers').count().first();
      expect(Number(rivers.count) - riversBefore).toBe(1);
    });
  });

});

describe('update', () => {
  let updateResult: any;
  let updatedSection: any;
  let originalSection: any;
  let oldPoiIds: any;

  beforeAll(async () => {
    originalSection = await db(true).table('sections_view').where({ id: updateData.id }).first();
    oldPoiIds = originalSection.pois.map((poi: any) => poi.id);
    expect(oldPoiIds).toHaveLength(2);
  });

  beforeEach(async () => {
    updateResult = await runQuery(upsertQuery, { section: updateData }, adminContext);
    updatedSection = updateResult && updateResult.data && updateResult.data.upsertSection;
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
    const sections = await db().table('sections').count().first();
    expect(Number(sections.count) - sectionsBefore).toBe(0);
  });

  it('should not change total number of rivers', async () => {
    const rivers = await db().table('rivers').count().first();
    expect(Number(rivers.count) - riversBefore).toBe(0);
  });

  it('should increase updated_at timestamp', () => {
    expect(updatedSection.createdAt).toBe(originalSection!.created_at.toISOString());
    expect(new Date(updatedSection.updatedAt).valueOf()).toBeGreaterThan(originalSection!.updated_at.valueOf());
  });

  it('should change the number of pois', async () => {
    const sp = await db().table('sections_points').count().first();
    expect(Number(sp.count) - sectionsPointsBefore).toBe(1);
    const points = await db().table('points').count().first();
    expect(Number(points.count) - pointsBefore).toBe(1);
  });

  it('should delete POI', async () => {
    const sp = await db().table('sections_points').whereIn('point_id', oldPoiIds).count().first();
    expect(Number(sp.count)).toBe(1);
    const p = await db().table('points').whereIn('id', oldPoiIds).count().first();
    expect(Number(p.count)).toBe(1);
  });

  it('should insert pois', async () => {
    const sp = await db().table('sections_points')
      .where({ section_id: updateData.id })
      .whereNotIn('point_id', oldPoiIds).count().first();
    expect(Number(sp.count)).toBe(2);
  });

  it('should update poi', async () => {
    const point = await db().table('points_view').select('name')
      .where({ id: 'ca0bee06-d445-11e7-9296-cec278b6b50a', language: 'en' }).first();
    expect(point.name).toBe('Updated poi name');
  });
});

describe('i18n', () => {
  const amotFr: SectionInput = {
    id: '21f2351e-d52a-11e7-9296-cec278b6b50a',
    name: 'Amot FR',
    river: {
      id: 'd4396dac-d528-11e7-9296-cec278b6b50a',
      name: 'Sjoa',
      region: { id: 'b968e2b2-76c5-11e7-b5a5-be2e44b06b34' },
    }, // Sjoa
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
  };

  it('should add translation', async () => {
    const upsertResult = await runQuery(upsertQuery, { section: amotFr, language: 'fr' }, adminContext);
    expect(upsertResult.errors).toBeUndefined();
    const translation = await db().table('sections_translations').select()
      .where({ section_id: amotFr.id, language: 'fr' }).first();
    expect(translation.name).toBe('Amot FR');
  });

  it('should modify common props when translation is added', async () => {
    const upsertResult = await runQuery(upsertQuery, { section: amotFr, language: 'fr' }, adminContext);
    expect(upsertResult.errors).toBeUndefined();
    const section = await db().table('sections').select()
      .where({ id: amotFr.id }).first();
    expect(section.rating).toBe(1);
  });

  it('should modify translation', async () => {
    const upsertResult = await runQuery(upsertQuery, { section: amotFr, language: 'ru' }, adminContext);
    expect(upsertResult.errors).toBeUndefined();
    const translation = await db().table('sections_translations').select()
      .where({ section_id: amotFr.id, language: 'ru' }).first();
    expect(translation).toEqual(expect.objectContaining({
      description: 'Amot description FR',
      season: 'Amot season FR',
      flows_text: 'Amot flows FR',
    }));
  });

  it('should update poi translation', async () => {
    const updateRu = {
      ...updateData,
      pois: [{
        id: 'ca0bee06-d445-11e7-9296-cec278b6b50a',
        name: 'Русской имя', // was 'Galicia Riv 1 Sec 1 Rapid',
        description: 'Русское описание ', // was 'Some rapid',
        kind: 'other', // was rapid
        coordinates: [2.1, 2.3, 3.4], // was [1.2, 3.2, 4.3]
      }],
    };
    const upsertResult = await runQuery(upsertQuery, { section: updateRu, language: 'ru' }, adminContext);
    expect(upsertResult.errors).toBeUndefined();
    const translation = await db().table('points_translations').select()
      .where({ language: 'ru', point_id: updateRu.pois[0].id }).first();
    expect(translation).toEqual(expect.objectContaining({
      name: 'Русской имя',
      description: 'Русское описание ',
    }));
  });
});
