import db, { holdTransaction, rollbackTransaction } from '../../../db';
import { adminContext, anonContext, userContext } from '../../../test/context';
import { noUnstable, runQuery } from '../../../test/db-helpers';
import { Duration, SectionInput } from '../../../ww-commons/features/sections/types';

let regionsPointsBefore: number;
let pointsBefore: number;
let riversBefore: number;

beforeAll(async () => {
  const rp = await db(true).table('sections_points').count().first();
  regionsPointsBefore = Number(rp.count);
  const points = await db(true).table('points').count().first();
  pointsBefore = Number(points.count);
  const rivers = await db(true).table('rivers').count().first();
  riversBefore = Number(rivers.count);
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
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.upsertSection).toBeNull();
  });

  it('user should not pass', async () => {
    const result = await runQuery(upsertQuery, { section: existingRiverSection }, userContext);
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.upsertSection).toBeNull();
  });

  it('should fail on invalid input', async () => {
    const result = await runQuery(upsertQuery, { section: invalidSection }, adminContext);
    expect(result.errors).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data!.upsertSection).toBeNull();
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

    });

    it('should not change total number of rivers', async () => {

    });

    it('should insert pois', async () => {

    });
  });

  describe('new river', () => {
    it('should return result', async () => {

    });

    it('should create new river', async () => {

    });
  });

});

describe('update', () => {
  it('should return result', async () => {

  });

  it('should not change total number of sections', async () => {

  });

  it('should not change total number of rivers', async () => {

  });

  it('should increase updated_at timestamp', () => {
  });

  it('should change the number of pois', async () => {

  });

  it('should delete POI', async () => {
  });

  it('should insert pois', async () => {
  });

  it('should update poi', async () => {
  });
});

describe('i18n', () => {
  it('should add translation', async () => {

  });

  it('should modify common props when translation is added', async () => {

  });

  it('should modify translation', async () => {

  });

  it('should update poi translation', async () => {

  });
});
