import { CoordinateSchema, PointInputSchema } from './validation';

import { PointInput } from './types';
import { createSafeValidator } from '@whitewater-guide/validation';

describe('loose coordinate schema', () => {
  const validator = createSafeValidator(CoordinateSchema);

  it('correct 2d', () => {
    expect(validator([120, 80])).toBeNull();
  });

  it('correct 3d', () => {
    expect(validator([120, 80, 22])).toBeNull();
  });

  it('undefined alt', () => {
    expect(validator([120, 80, undefined])).toBeNull();
  });

  it('null alt', () => {
    expect(validator([120, 80, null])).toBeNull();
  });

  it('error', () => {
    const errors = validator([220, 180]);
    expect(errors).toMatchSnapshot();
  });

  it('error when undefined', () => {
    const errors = validator(undefined);
    expect(errors).toMatchSnapshot();
  });

  it('wrong array length', () => {
    const errors = validator([3, 3, -11.5, 33]);
    expect(errors).not.toBeNull();
    expect(errors).toMatchSnapshot();
  });

  it('error when some are string', () => {
    const errors = validator([3, '3', 3]);
    expect(errors).not.toBeNull();
    expect(errors).toMatchSnapshot();
  });
});

describe('point input schema', () => {
  const validator = createSafeValidator(PointInputSchema);

  type TestValue = [string, PointInput];

  const correct: TestValue[] = [
    [
      'basic point',
      {
        id: null,
        name: null,
        description: null,
        coordinates: [125, 16, 11.1],
        kind: 'hazard',
      },
    ],
    [
      '2d point',
      {
        id: null,
        name: null,
        description: null,
        coordinates: [125, 16],
        kind: 'hazard',
      },
    ],
    [
      'point with undefined name and description',
      {
        id: null,
        coordinates: [125, 16, 11.1],
        kind: 'hazard',
      },
    ],
    [
      'point with empty name and description',
      {
        id: '7b6c1195-b74e-4560-b200-b41782237f3c',
        name: '',
        description: '',
        coordinates: [125, 16, 11.1],
        kind: 'hazard',
      },
    ],
    [
      'full point',
      {
        id: '7b6c1195-b74e-4560-b200-b41782237f3c',
        name: 'foo',
        description: 'bar',
        coordinates: [125, 16, 11.1],
        kind: 'hazard',
      },
    ],
  ];

  const incorrect: TestValue[] = [
    [
      'all',
      {
        id: 'foo',
        name: 'name',
        description: 'description',
        coordinates: [300, 300, 101],
        kind: 'bar',
      },
    ],
    [
      'lng only',
      {
        id: 'foo',
        name: 'name',
        description: 'description',
        coordinates: [30] as any,
        kind: 'put-in',
      },
    ],
    [
      'lat only',
      {
        id: 'foo',
        name: 'name',
        description: 'description',
        coordinates: [undefined, 30] as any,
        kind: 'put-in',
      },
    ],
    [
      'extra coordinate array item',
      {
        id: 'foo',
        name: 'name',
        description: 'description',
        coordinates: [30, 30, 30, 30] as any,
        kind: 'put-in',
      },
    ],
  ];

  it.each(correct)('should be valid for %s', (_, value) => {
    expect(validator(value)).toBeNull();
  });

  it.each(incorrect)('should be invalid for %s', (_, value) => {
    const result = validator(value);
    expect(result).not.toBeNull();
    expect(result).toMatchSnapshot();
  });
});
