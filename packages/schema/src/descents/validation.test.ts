import { createSafeValidator } from '@whitewater-guide/validation';

import { DescentInput } from '../__generated__/types';
import { DescentInputSchema } from './validation';

const validator = createSafeValidator(DescentInputSchema);

type TestValue = [string, any];

const required: DescentInput = {
  sectionId: '879ca106-c264-11e8-a355-529269fb1459',
  startedAt: new Date('2021-06-20T15:48:46.458Z'),
};

const full: DescentInput = {
  ...required,
  id: '7ce3319e-c264-11e8-a355-529269fb1459',
  duration: 10,
  level: {
    value: 20,
    unit: 'cm',
  },
  comment: 'foo',
  public: true,
};

const correctValues: TestValue[] = [
  ['full value', full],
  ['required fields only', required],
  [
    'nulls',
    {
      ...required,
      id: null,
      duration: null,
      level: null,
      comment: null,
      public: null,
    },
  ],
  ['partial level', { ...required, level: { value: 300 } }],
];

const incorrectValues: TestValue[] = [
  ['bad uuid', { ...required, id: 'foo' }],
  ['bad section id', { ...required, sectionId: 'foo' }],
  ['bad date', { ...required, startedAt: 'foo' }],
  ['extra fields', { ...required, foo: 'bar' }],
];

it.each(correctValues)('should be valid for %s', (_, value) => {
  expect(validator(value)).toBeNull();
});

it.each(incorrectValues)('should be invalid for %s', (_, value) => {
  const error = validator(value);
  expect(error).not.toBeNull();
  expect(error).toMatchSnapshot();
});
