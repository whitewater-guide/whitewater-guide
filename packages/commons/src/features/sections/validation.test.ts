import { NEW_ID } from '../../apollo';
import { createSafeValidator } from '../../validation';
import { MediaKind } from '../media';
import {
  Duration,
  GaugeBinding,
  SectionAdminSettings,
  SectionInput,
} from './types';
import {
  GaugeBindingSchema,
  SectionAdminSettingsSchema,
  SectionInputSchema,
} from './validation';

describe('GaugeBinding', () => {
  const validator = createSafeValidator(GaugeBindingSchema);
  type TestValue = [string, GaugeBinding];

  const correct: GaugeBinding = {
    minimum: -10,
    maximum: 10,
    optimum: 10,
    impossible: 10,
    approximate: true,
    formula: 'x + 10',
  };

  const correctValues: TestValue[] = [
    ['full value', correct],
    [
      'null value',
      {
        minimum: null,
        maximum: null,
        optimum: null,
        impossible: null,
        approximate: null,
        formula: null,
      },
    ],
    ['empty value', {}],
  ];

  const incorrectValues: TestValue[] = [
    ['incorrect formula', { ...correct, formula: 'x *' }],
    ['too many variables', { ...correct, formula: 'x * y + 2' }],
    ['bad variable', { ...correct, formula: 'X + 10' }],
    ['extra fields', { ...correct, foo: 'X + 10' } as any],
  ];

  it.each(correctValues)('should be valid for %s', (_, value) => {
    expect(validator(value)).toBeNull();
  });

  it.each(incorrectValues)('should be invalid for %s', (_, value) => {
    const error = validator(value);
    expect(error).not.toBeNull();
    expect(error).toMatchSnapshot();
  });
});

describe('SectionInput', () => {
  const validator = createSafeValidator(SectionInputSchema);
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
    shape: [
      [0, 0, 0],
      [0.1, 1, 0],
    ],
    distance: 10,
    drop: 100,
    duration: Duration.LAPS,
    difficulty: 3.5,
    difficultyXtra: 'X',
    rating: 2.5,
    tags: [{ id: '4x4' }, { id: 'portage' }],
    pois: [
      {
        id: 'b5678064-c34b-11e8-a355-529269fb1459',
        coordinates: [1, 1.3, 200],
        description: 'poi description',
        name: 'some poi',
        kind: 'portage',
      },
    ],
    media: [
      {
        id: '9f0ff4b6-c258-11e8-a355-529269fb1459',
        description: 'description',
        kind: MediaKind.photo,
        resolution: [800, 600],
        url: 'jhakjfh',
        weight: -3,
        copyright: 'Copyright',
      },
    ],
    hidden: false,
    helpNeeded: 'fix duration',
  };

  const correctValues: TestValue[] = [
    ['full value', correct],
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
        createdBy: null,
        suggestionId: null,
        helpNeeded: null,
        importId: null,
      },
    ],
    [
      'with createdBy',
      { ...correct, createdBy: '880e1a40-bd02-11e9-9cb5-2a2ae2dbcce4' },
    ],
    [
      'with suggestionId',
      { ...correct, createdBy: '8ef42282-bd02-11e9-9cb5-2a2ae2dbcce4' },
    ],
    ['with importId', { ...correct, importId: 'whatever' }],
    ['empty description', { ...correct, description: '' }],
    ['empty season', { ...correct, season: '' }],
    ['empty season numeric', { ...correct, seasonNumeric: [] }],
    ['empty flows text', { ...correct, flowsText: '' }],
    ['empty difficultyXtra', { ...correct, difficultyXtra: '' }],
    [
      'new river',
      {
        ...correct,
        river: { id: NEW_ID, name: 'New river' },
        region: { id: 'cf8c20ac-ae06-11e9-a2a3-2a2ae2dbcce4' },
      },
    ],
    ['empty media', { ...correct, media: [] }],
  ];

  const incorrectValues: TestValue[] = [
    ['bad id', { ...correct, id: 'foo' }],
    ['bad name', { ...correct, name: '' }],
    ['bad alt name', { ...correct, altNames: ['foo', '', 'bar'] }],
    [
      'bad season numeric (bad half-month)',
      { ...correct, seasonNumeric: [10, 100, -10, 11] },
    ],
    [
      'bad season numeric (too many items)',
      { ...correct, seasonNumeric: Array(30).fill(10) },
    ],
    ['bad river id', { ...correct, river: { id: 'foo' } }],
    ['bad gauge id', { ...correct, gauge: { id: 'foo' } }],
    ['bad shape (not enough points)', { ...correct, shape: [[1, 2, 3]] }],
    [
      'bad shape (bad point)',
      {
        ...correct,
        shape: [
          [1, 2, 3],
          [300, 1, 1],
          [2, 3, 4],
        ],
      },
    ],
    ['bad distance', { ...correct, distance: -100 }],
    ['bad drop', { ...correct, drop: -100 }],
    ['bad duration', { ...correct, duration: -100 }],
    ['bad difficulty (min)', { ...correct, difficulty: -0.5 }],
    ['bad difficulty (max)', { ...correct, difficulty: 7.5 }],
    ['bad difficulty (fraction)', { ...correct, difficulty: 4.4 }],
    ['bad extra difficulty', { ...correct, difficultyXtra: 'x'.repeat(50) }],
    ['bad rating (min)', { ...correct, rating: -0.5 }],
    ['bad rating (max)', { ...correct, rating: 5.5 }],
    ['bad rating (fraction)', { ...correct, rating: 4.4 }],
    ['bad tags', { ...correct, tags: ['foo', '', 'bar'] }],
    [
      'bad pois',
      {
        ...correct,
        pois: [
          {
            id: null,
            description: null,
            kind: 'dam',
            name: null,
            coordinates: [1, 1, 1],
          },
          {
            id: 'foo',
            description: null,
            kind: 'dam',
            name: null,
            coordinates: [1, 1, 1],
          },
          {
            id: null,
            description: null,
            kind: 'dam',
            name: null,
            coordinates: [1, 2, 1],
          },
        ],
      },
    ],
    ['null media', { ...correct, media: null as any }],
    [
      'incorrect media',
      { ...correct, media: [{ ...correct.media![0], id: 'foo' }] },
    ],
    ['extra fields', { ...correct, foo: 'bar' } as any],
    ['new river without name', { ...correct, river: { id: NEW_ID } }],
  ];

  it.each(correctValues)('should be valid for %s', (_, value) => {
    expect(validator(value)).toBeNull();
  });

  it.each(incorrectValues)('should be invalid for %s', (_, value) => {
    const error = validator(value);
    expect(error).not.toBeNull();
    expect(error).toMatchSnapshot();
  });
});

describe('SectionAdminSettings', () => {
  const validator = createSafeValidator(SectionAdminSettingsSchema);
  type TestValue = [string, SectionAdminSettings];

  const correct: SectionAdminSettings = { demo: true };

  const correctValues: TestValue[] = [['full value', correct]];
  const incorrectValues: TestValue[] = [
    ['demo undefined', {} as any],
    ['extra fields', { ...correct, foo: 'bar' } as any],
  ];

  it.each(correctValues)('should be valid for %s', (_, value) => {
    expect(validator(value)).toBeNull();
  });

  it.each(incorrectValues)('should be invalid for %s', (_, value) => {
    const error = validator(value);
    expect(error).not.toBeNull();
    expect(error).toMatchSnapshot();
  });
});
