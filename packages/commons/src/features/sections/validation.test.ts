import { createValidator } from '../../utils/validation';
import { TagCategory } from '../tags';
import { Duration, GaugeBinding, SectionAdminSettings, SectionFormInput, SectionInput } from './types';
import { GaugeBindingStruct, SectionAdminSettingsStruct, SectionFormStruct, SectionInputStruct } from './validation';

describe('GaugeBinding', () => {
  const validator = createValidator(GaugeBindingStruct);
  type TestValue = [string, GaugeBinding];

  const correctValues: TestValue[] = [
    [
      'full value',
      {
        minimum: -10,
        maximum: 10,
        optimum: 10,
        impossible: 10,
        approximate: true,
      },
    ],
    [
      'null value',
      {
        minimum: null,
        maximum: null,
        optimum: null,
        impossible: null,
        approximate: null,
      },
    ],
    [
      'empty value',
      {},
    ],
  ];

  it.each(correctValues)('should be valid for %s', (_, value) => {
    expect(validator(value)).toBeNull();
  });

});

describe('SectionInput', () => {
  const validator = createValidator(SectionInputStruct);
  type TestValue = [string, SectionInput];

  const correct: SectionInput = {
    id: 'eda6bd7e-c34a-11e8-a355-529269fb1459',
    name: 'Section',
    altNames: ['Alt name 1', 'Alt name 2'],
    description: 'Section description',
    season: 'When it rains',
    seasonNumeric: [10, 11, 12],
    river: { id: '1aa9fd9a-c34b-11e8-a355-529269fb1459' },
    gauge: { id: '2bedcd8e-c34b-11e8-a355-529269fb1459' },
    levels: { minimum: 10, optimum: null },
    flows: { maximum: 11, approximate: true },
    flowsText: 'unknown',
    shape: [[0, 0, 0], [0.1, 1, 0]],
    distance: 10,
    drop: 100,
    duration: Duration.LAPS,
    difficulty: 3.5,
    difficultyXtra: 'X',
    rating: 2.5,
    tags: [{ id: '4x4' }, { id: 'portage' }],
    pois: [{
      id: 'b5678064-c34b-11e8-a355-529269fb1459',
      coordinates: [1, 1.3, 200],
      description: 'poi description',
      name: 'some poi',
      kind: 'portage',
    }],
    hidden: false,
  };

  const correctValues: TestValue[] = [
    [
      'full value',
      correct,
    ],
    [
      'null value',
      {
        ...correct,
        id: null,
        altNames: null,
        description: null,
        difficultyXtra: null,
        distance: null,
        drop: null,
        duration: null,
        flows: null,
        flowsText: null,
        gauge: null,
        levels: null,
        rating: null,
        season: null,
      },
    ],
    [
      'empty description',
      { ...correct, description: '' },
    ],
    [
      'empty season',
      { ...correct, season: '' },
    ],
    [
      'empty season numeric',
      { ...correct, seasonNumeric: [] },
    ],
    [
      'empty flows text',
      { ...correct, flowsText: '' },
    ],
    [
      'empty difficultyXtra',
      { ...correct, difficultyXtra: '' },
    ],
  ];

  const incorrectValues: TestValue[] = [
    [
      'bad id',
      { ...correct, id: 'foo' },
    ],
    [
      'bad name',
      { ...correct, name: '' },
    ],
    [
      'bad alt name',
      { ...correct, altNames: ['foo', '', 'bar'] },
    ],
    [
      'bad season numeric (bad half-month)',
      { ...correct, seasonNumeric: [10, 100, -10, 11] },
    ],
    [
      'bad season numeric (too many items)',
      { ...correct, seasonNumeric: Array(30).fill(10) },
    ],
    [
      'bad river id',
      { ...correct, river: { id: 'foo' } },
    ],
    [
      'bad gauge id',
      { ...correct, gauge: { id: 'foo' } },
    ],
    [
      'bad shape (not enough points)',
      { ...correct, shape: [[1, 2, 3]] },
    ],
    [
      'bad shape (bad point)',
      { ...correct, shape: [[1, 2, 3], [300, 1, 1], [2, 3, 4]] },
    ],
    [
      'bad distance',
      { ...correct, distance: -100 },
    ],
    [
      'bad drop',
      { ...correct, drop: -100 },
    ],
    [
      'bad duration',
      { ...correct, duration: -100 },
    ],
    [
      'bad difficulty (min)',
      { ...correct, difficulty: -0.5 },
    ],
    [
      'bad difficulty (max)',
      { ...correct, difficulty: 5.5 },
    ],
    [
      'bad difficulty (fraction)',
      { ...correct, difficulty: 4.4 },
    ],
    [
      'bad extra difficulty',
      { ...correct, difficultyXtra: 'x'.repeat(50) },
    ],
    [
      'bad rating (min)',
      { ...correct, rating: -0.5 },
    ],
    [
      'bad rating (max)',
      { ...correct, rating: 5.5 },
    ],
    [
      'bad rating (fraction)',
      { ...correct, rating: 4.4 },
    ],
    [
      'bad tags',
      { ...correct, tags: ['foo', '', 'bar'] },
    ],
    [
      'bad pois',
      {
        ...correct,
        pois: [
          { id: null, description: null, kind: 'dam', name: null, coordinates: [1, 1, 1] },
          { id: 'foo', description: null, kind: 'dam', name: null, coordinates: [1, 1, 1] },
          { id: null, description: null, kind: 'dam', name: null, coordinates: [1, 2, 1] },
        ],
      },
    ],
    [
      'extra fields',
      { ...correct, foo: 'bar' } as any,
    ],
  ];

  it.each(correctValues)('should be valid for %s', (_, value) => {
    expect(validator(value)).toBeNull();
  });

  it.each(incorrectValues)('should be invalid for %s', (_, value) => {
    expect(validator(value)).not.toBeNull();
    expect(validator(value)).toMatchSnapshot();
  });
});

describe('SectionFormInput', () => {
  interface TestRichText {
    markdown: string;
    prosemirror: { state: string };
  }
  type TestFormInput = SectionFormInput<TestRichText>;
  const validator = createValidator(SectionFormStruct());
  type TestValue = [string, TestFormInput];

  const correct: TestFormInput = {
    id: 'eda6bd7e-c34a-11e8-a355-529269fb1459',
    name: 'Section',
    altNames: ['Alt name 1', 'Alt name 2'],
    description: {
      markdown: 'markdown',
      prosemirror: { state: 'prosemirror' },
    },
    season: 'When it rains',
    seasonNumeric: [10, 11, 12],
    river: { id: '1aa9fd9a-c34b-11e8-a355-529269fb1459', name: 'river name' },
    gauge: { id: '2bedcd8e-c34b-11e8-a355-529269fb1459' },
    levels: { minimum: 10, optimum: null },
    flows: { maximum: 11, approximate: true },
    flowsText: 'unknown',
    shape: [[0, 0, 0], [0.1, 1, 0]],
    distance: 10,
    drop: 100,
    duration: Duration.LAPS,
    difficulty: 3.5,
    difficultyXtra: 'X',
    rating: 2.5,
    kayakingTags: [
      { id: '4x4', name: '4x4', category: TagCategory.kayaking },
      { id: 'portage', name: 'portage', category: TagCategory.kayaking },
    ],
    hazardsTags: [
      { id: '4x4', name: '4x4', category: TagCategory.hazards },
      { id: 'portage', name: 'portage', category: TagCategory.hazards },
    ],
    supplyTags: [
      { id: '4x4', name: '4x4', category: TagCategory.supply },
      { id: 'portage', name: 'portage', category: TagCategory.supply },
    ],
    miscTags: [
      { id: '4x4', name: '4x4', category: TagCategory.misc },
      { id: 'portage', name: 'portage', category: TagCategory.misc },
    ],
    pois: [{
      id: 'b5678064-c34b-11e8-a355-529269fb1459',
      coordinates: [1, 1.3, 200],
      description: 'poi description',
      name: 'some poi',
      kind: 'portage',
    }],
    hidden: false,
  };

  const correctValues: TestValue[] = [
    [
      'full value',
      correct,
    ],
    [
      'null value',
      {
        ...correct,
        id: null,
        altNames: null,
        difficultyXtra: null,
        distance: null,
        drop: null,
        duration: null,
        flows: null,
        flowsText: null,
        gauge: null,
        levels: null,
        rating: null,
        season: null,
      },
    ],
    [
      'empty season',
      { ...correct, season: '' },
    ],
    [
      'empty season numeric',
      { ...correct, seasonNumeric: [] },
    ],
    [
      'empty flows text',
      { ...correct, flowsText: '' },
    ],
    [
      'empty difficultyXtra',
      { ...correct, difficultyXtra: '' },
    ],
  ];

  const incorrectValues: TestValue[] = [
    [
      'bad id',
      { ...correct, id: 'foo' },
    ],
    [
      'bad name',
      { ...correct, name: '' },
    ],
    [
      'bad alt name',
      { ...correct, altNames: ['foo', '', 'bar'] },
    ],
    [
      'bad season numeric (bad half-month)',
      { ...correct, seasonNumeric: [10, 100, -10, 11] },
    ],
    [
      'bad season numeric (too many items)',
      { ...correct, seasonNumeric: Array(30).fill(10) },
    ],
    [
      'bad river id',
      { ...correct, river: { id: 'foo' } },
    ],
    [
      'bad gauge id',
      { ...correct, gauge: { id: 'foo' } },
    ],
    [
      'bad shape (not enough points)',
      { ...correct, shape: [[1, 2, 3]] },
    ],
    [
      'bad shape (bad point)',
      { ...correct, shape: [[1, 2, 3], [300, 1, 1], [2, 3, 4]] },
    ],
    [
      'bad distance',
      { ...correct, distance: -100 },
    ],
    [
      'bad drop',
      { ...correct, drop: -100 },
    ],
    [
      'bad duration',
      { ...correct, duration: -100 },
    ],
    [
      'bad difficulty (min)',
      { ...correct, difficulty: -0.5 },
    ],
    [
      'bad difficulty (max)',
      { ...correct, difficulty: 5.5 },
    ],
    [
      'bad difficulty (fraction)',
      { ...correct, difficulty: 4.4 },
    ],
    [
      'bad extra difficulty',
      { ...correct, difficultyXtra: 'x'.repeat(50) },
    ],
    [
      'bad rating (min)',
      { ...correct, rating: -0.5 },
    ],
    [
      'bad rating (max)',
      { ...correct, rating: 5.5 },
    ],
    [
      'bad rating (fraction)',
      { ...correct, rating: 4.4 },
    ],
    [
      'bad tag',
      {
        ...correct,
        kayakingTags: [
          { id: '4x4', name: '4x4', category: TagCategory.kayaking },
          { id: '4', name: '44x4', category: TagCategory.kayaking },
          { id: 'misc', name: 'misc', category: TagCategory.kayaking },
        ],
      },
    ],
    [
      'present tag field',
      {
        ...correct,
        tags: [{ id: '4x4' }],
      },
    ],
    [
      'bad pois',
      {
        ...correct,
        pois: [
          { id: null, description: null, kind: 'dam', name: null, coordinates: [1, 1, 1] },
          { id: 'foo', description: null, kind: 'dam', name: null, coordinates: [1, 1, 1] },
          { id: null, description: null, kind: 'dam', name: null, coordinates: [1, 2, 1] },
        ],
      },
    ],
    [
      'extra fields',
      { ...correct, foo: 'bar' } as any,
    ],
  ];

  it.each(correctValues)('should be valid for %s', (_, value) => {
    expect(validator(value)).toBeNull();
  });

  it.each(incorrectValues)('should be invalid for %s', (_, value) => {
    expect(validator(value)).not.toBeNull();
    expect(validator(value)).toMatchSnapshot();
  });
});

describe('SectionAdminSettings', () => {
  const validator = createValidator(SectionAdminSettingsStruct);
  type TestValue = [string, SectionAdminSettings];

  const correct: SectionAdminSettings = { demo: true };

  const correctValues: TestValue[] = [
    [
      'full value',
      correct,
    ],
  ];
  const incorrectValues: TestValue[] = [
    [
      'extra fields',
      { ...correct, foo: 'bar' } as any,
    ],
  ];

  it.each(correctValues)('should be valid for %s', (_, value) => {
    expect(validator(value)).toBeNull();
  });

  it.each(incorrectValues)('should be invalid for %s', (_, value) => {
    expect(validator(value)).not.toBeNull();
    expect(validator(value)).toMatchSnapshot();
  });
});
