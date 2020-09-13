import pickBy from 'lodash/pickBy';
import { DeepPartial } from 'utility-types';

import { TagCategory } from '../tags';
import { getFilter } from './filterSection';
import {
  DefaultSectionFilterOptions,
  Duration,
  Section,
  SectionFilterOptions,
} from './types';

const section: DeepPartial<Section> = {
  id: 'ea67cd9e-9917-11e9-bd1b-3fc9ab40b1ef',
  name: 'Box Canyon',
  altNames: ['föo'],
  river: {
    id: 'd9bca500-9912-11e9-a5e2-fb6c856282ee',
    name: 'Ashlu',
    altNames: ['Áshlu'],
    __typename: 'River',
  },
  __typename: 'Section',
  hidden: false,
  demo: false,
  season: null,
  seasonNumeric: [8, 9, 14, 15, 16],
  distance: 2.5,
  drop: null,
  duration: Duration.TWICE,
  difficulty: 5,
  difficultyXtra: null,
  rating: 5,
  description: 'foo',
  putIn: {
    id: 'ea67cd9e-9917-11e9-bd1b-3fc9ab40b1ef_putIn',
    coordinates: [-123.360268689205, 49.9342537602352, 0],
    kind: 'put-in',
    __typename: 'Point',
  },
  takeOut: {
    id: 'ea67cd9e-9917-11e9-bd1b-3fc9ab40b1ef_takeOut',
    coordinates: [-123.338895501885, 49.9184502693028, 0],
    kind: 'take-out',
    __typename: 'Point',
  },
  shape: [
    [-123.360268689205, 49.9342537602352, 0],
    [-123.338895501885, 49.9184502693028, 0],
  ],
  gauge: null,
  levels: {
    minimum: 17,
    maximum: 30,
    optimum: 26,
    impossible: 32,
    approximate: false,
    formula: null,
    __typename: 'GaugeBinding',
  },
  flows: null,
  flowsText: null,
  createdAt: '2019-06-27T20:12:40.735Z',
  updatedAt: '2019-06-27T20:12:40.735Z',
  pois: [],
  tags: [
    {
      id: 'bedrock',
      name: 'Bedrock',
      category: TagCategory.kayaking,
      __typename: 'Tag',
    },
    {
      id: 'canyon',
      name: 'Canyon',
      category: TagCategory.kayaking,
      __typename: 'Tag',
    },
    {
      id: 'creeking',
      name: 'Creeking',
      category: TagCategory.kayaking,
      __typename: 'Tag',
    },
    {
      id: 'waterfalls',
      name: 'Waterfalls',
      category: TagCategory.kayaking,
      __typename: 'Tag',
    },
    {
      id: 'dam',
      name: 'Dam',
      category: TagCategory.hazards,
      __typename: 'Tag',
    },
    {
      id: 'must-run',
      name: 'Must-run',
      category: TagCategory.hazards,
      __typename: 'Tag',
    },
    {
      id: 'syphons',
      name: 'Syphons',
      category: TagCategory.hazards,
      __typename: 'Tag',
    },
    {
      id: 'artificial',
      name: 'Dam release',
      category: TagCategory.supply,
      __typename: 'Tag',
    },
    {
      id: 'rain',
      name: 'Rains',
      category: TagCategory.supply,
      __typename: 'Tag',
    },
    {
      id: 'snowmelt',
      name: 'Snowmelt',
      category: TagCategory.supply,
      __typename: 'Tag',
    },
    {
      id: 'hike_out',
      name: 'Hike-out',
      category: TagCategory.misc,
      __typename: 'Tag',
    },
  ],
};

const testFn = (
  terms?: Partial<SectionFilterOptions>,
  extra?: DeepPartial<Section>,
) => {
  const definedTerms = terms && pickBy(terms, (v) => v !== undefined);
  const filter = getFilter({ ...DefaultSectionFilterOptions, ...definedTerms });
  return filter({ ...section, ...extra } as any);
};

it('should satisfy default filter', () => {
  expect(testFn()).toBe(true);
});

describe('names', () => {
  it('name, case-insensitive', () => {
    expect(testFn({ searchString: 'box' })).toBe(true);
  });

  it('name, with diacritics', () => {
    expect(testFn({ searchString: 'böx' })).toBe(true);
  });

  it('river name, case-insensitive', () => {
    expect(testFn({ searchString: 'shlu' })).toBe(true);
  });

  it('river name, with diacritics', () => {
    expect(testFn({ searchString: 'shlū' })).toBe(true);
  });

  it('alt name', () => {
    expect(testFn({ searchString: 'foo' })).toBe(true);
  });
  it('alt name, with diacritics', () => {
    expect(testFn({ searchString: 'fÖo' })).toBe(true);
  });

  it('river alt name', () => {
    expect(testFn({ searchString: 'ash' })).toBe(true);
  });

  it('river alt name, with diacritics', () => {
    expect(testFn({ searchString: 'Äsh' })).toBe(true);
  });
});

describe('difficulty', () => {
  describe('in range', () => {
    it.each([[[5, 5]], [[4.5, 5]], [[5, 5.5]], [[0, 6]], [undefined]])(
      '%s should pass',
      (difficulty: any) => {
        expect(testFn({ difficulty })).toBe(true);
      },
    );

    it.each([[[1, 4]], [[5.5, 6]]])('%s should fail', (difficulty: any) => {
      expect(testFn({ difficulty })).toBe(false);
    });
  });

  describe('lower edge value', () => {
    it.each([[[0, 0]], [[0, 1]], [[0, 6]], [undefined]])(
      '%s should pass',
      (difficulty: any) => {
        expect(testFn({ difficulty }, { difficulty: 0 })).toBe(true);
      },
    );

    it.each([[[1, 6]]])('%s should fail', (difficulty: any) => {
      expect(testFn({ difficulty }, { difficulty: 0 })).toBe(false);
    });
  });

  describe('upper edge value', () => {
    it.each([[[6, 6]], [[5, 6]], [[0, 6]], [undefined]])(
      '%s should pass',
      (difficulty: any) => {
        expect(testFn({ difficulty }, { difficulty: 6 })).toBe(true);
      },
    );

    it.each([[[0, 5]]])('%s should fail', (difficulty: any) => {
      expect(testFn({ difficulty }, { difficulty: 6 })).toBe(false);
    });
  });
});

describe('duration', () => {
  describe('in range', () => {
    it.each([
      [[Duration.TWICE, Duration.TWICE]],
      [[Duration.LAPS, Duration.TWICE]],
      [[Duration.TWICE, Duration.DAYRUN]],
      [[Duration.LAPS, Duration.MULTIDAY]],
      [undefined],
    ])('%s should pass', (duration: any) => {
      expect(testFn({ duration })).toBe(true);
    });

    it.each([
      [[Duration.LAPS, Duration.LAPS]],
      [[Duration.DAYRUN, Duration.MULTIDAY]],
    ])('%s should fail', (duration: any) => {
      expect(testFn({ duration })).toBe(false);
    });
  });

  describe('lower edge', () => {
    it.each([
      [[Duration.LAPS, Duration.LAPS]],
      [[Duration.LAPS, Duration.TWICE]],
      [[Duration.LAPS, Duration.MULTIDAY]],
      [undefined],
    ])('%s should pass', (duration: any) => {
      expect(testFn({ duration }, { duration: Duration.LAPS })).toBe(true);
    });

    it.each([[[Duration.TWICE, Duration.MULTIDAY]]])(
      '%s should fail',
      (duration: any) => {
        expect(testFn({ duration }, { duration: Duration.LAPS })).toBe(false);
      },
    );
  });

  describe('upper edge', () => {
    it.each([
      [[Duration.MULTIDAY, Duration.MULTIDAY]],
      [[Duration.OVERNIGHTER, Duration.MULTIDAY]],
      [[Duration.LAPS, Duration.MULTIDAY]],
      [undefined],
    ])('%s should pass', (duration: any) => {
      expect(testFn({ duration }, { duration: Duration.MULTIDAY })).toBe(true);
    });

    it.each([[[Duration.LAPS, Duration.OVERNIGHTER]]])(
      '%s should fail',
      (duration: any) => {
        expect(testFn({ duration }, { duration: Duration.MULTIDAY })).toBe(
          false,
        );
      },
    );
  });

  it.each([
    [[Duration.LAPS, Duration.LAPS]],
    [[Duration.MULTIDAY, Duration.MULTIDAY]],
    [[Duration.TWICE, Duration.DAYRUN]],
    [[Duration.LAPS, Duration.MULTIDAY]],
    [undefined],
  ])('null value and %s should pass', (duration: any) => {
    expect(testFn({ duration }, { duration: null })).toBe(true);
  });
});

describe('tags', () => {
  it('with present tag', () => {
    expect(testFn({ withTags: ['dam'] })).toBe(true);
  });

  it('with missing tag', () => {
    expect(testFn({ withTags: ['4x4'] })).toBe(false);
  });

  it('without present tag', () => {
    expect(testFn({ withoutTags: ['dam'] })).toBe(false);
  });

  it('without missing tag', () => {
    expect(testFn({ withoutTags: ['4x4'] })).toBe(true);
  });
});

describe('season', () => {
  it.each([[undefined], [[0, 23]], [[3, 3]], [[3, 4]], [[4, 3]]])(
    'empty array should pass %s',
    (seasonNumeric: any) => {
      expect(testFn({ seasonNumeric }, { seasonNumeric: [] })).toBe(true);
    },
  );

  it.each([[[8, 8]], [[9, 9]], [[9, 14]], [[4, 8]], [[16, 17]], [12, 1]])(
    '%s should pass',
    (seasonNumeric: any) => {
      expect(testFn({ seasonNumeric })).toBe(true);
    },
  );

  it.each([[[10, 13]], [[17, 7]]])('%s should fail', (seasonNumeric: any) => {
    expect(testFn({ seasonNumeric })).toBe(false);
  });
});
