import { RegionAdminSettings, RegionInput } from './types';
import { RegionAdminSettingsSchema, RegionInputSchema } from './validation';

import { createSafeValidator } from '@whitewater-guide/validation';

describe('RegionInput', () => {
  const validator = createSafeValidator(RegionInputSchema);
  type TestValue = [string, RegionInput];

  const correct: RegionInput = {
    id: 'ca844cf2-c3b9-11e8-a355-529269fb1459',
    name: 'region',
    description: 'description',
    bounds: [
      [1, 1, 1],
      [2, 2, 2],
      [3, 3, 3],
    ],
    season: 'when it rains',
    seasonNumeric: [10, 11, 12],
    pois: [
      {
        id: 'b5678064-c34b-11e8-a355-529269fb1459',
        coordinates: [1, 1.3, 200],
        description: 'poi description',
        name: 'some poi',
        kind: 'portage',
      },
    ],
  };

  const correctValues: TestValue[] = [
    ['full value', correct],
    [
      'null value',
      {
        ...correct,
        id: null,
        description: null,
        pois: [],
        season: null,
        seasonNumeric: [],
      },
    ],
    ['empty description', { ...correct, description: '' }],
    ['empty season', { ...correct, season: '' }],
  ];

  const incorrectValues: TestValue[] = [
    ['null name', { ...correct, name: null }],
    ['bad id', { ...correct, id: 'foo' }],
    ['empty name', { ...correct, name: '' }],
    [
      'bad season numeric (bad half-month)',
      { ...correct, seasonNumeric: [10, 100, -10, 11] },
    ],
    [
      'bad season numeric (too many items)',
      { ...correct, seasonNumeric: Array(30).fill(10) },
    ],
    [
      'bad bounds',
      {
        ...correct,
        bounds: [
          [1, 2, 3],
          [2, 2, 2],
        ],
      },
    ],
    ['null bounds', { ...correct, bounds: null }],
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

describe('RegionAdminSettings', () => {
  const validator = createSafeValidator(RegionAdminSettingsSchema);
  type TestValue = [string, RegionAdminSettings];

  const correct: RegionAdminSettings = {
    id: '4e0d6c92-c3bb-11e8-a355-529269fb1459',
    hidden: false,
    premium: false,
    sku: 'region.sku',
    mapsSize: 123456789,
    coverImage: {
      mobile: 'cover.jpg',
    },
  };

  const correctValues: TestValue[] = [
    ['full value', correct],
    [
      'null value',
      {
        ...correct,
        sku: null,
        coverImage: {
          mobile: null,
        },
      },
    ],
  ];

  const incorrectValues: TestValue[] = [
    ['bad id', { ...correct, id: 'foo' }],
    ['empty sku', { ...correct, sku: '' }],
    ['bad sku 1', { ...correct, sku: 'region.x' }],
    ['bad sku 2', { ...correct, sku: 'region.g@licia' }],
    ['empty cover image', { ...correct, coverImage: { mobile: '' } }],
    ['float size', { ...correct, mapsSize: 1.5 }],
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
