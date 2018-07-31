import { createValidator } from '../../utils/validation';
import { PointInput } from './types';
import { CoordinateStruct, CoordinateStructLoose, PointInputStruct } from './validation';

describe('coordinate schema', () => {
  const validator = createValidator(CoordinateStruct);

  it('correct', () => {
    expect(validator([120, 80, 11.5])).toBeNull();
  });

  it('error', () => {
    const errors = validator([220, 120, -11.5]);
    expect(errors).toMatchSnapshot();
  });
});

describe('loose coordinate schema', () => {
  const validator = createValidator(CoordinateStructLoose);

  it('correct', () => {
    expect(validator([120, 80])).toBeNull();
  });

  it('error', () => {
    const errors = validator([220, 180]);
    expect(errors).toMatchSnapshot();
  });
});

describe('point input schema', () => {
  const validator = createValidator(PointInputStruct);

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

  it.each(correct)(
    'should be valid for %s',
    (_, value) => {
      expect(validator(value)).toBeNull();
    },
  );

  it('should return errors for incorrect input', () => {
    const incorrect: PointInput = {
      id: 'foo',
      name: 'name',
      description: 'description',
      coordinates: [300, 300, 101],
      kind: 'bar',
    };
    expect(validator(incorrect)).toMatchSnapshot();
  });

});
