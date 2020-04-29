import { RiverInput } from './types';
import { RiverInputSchema } from './validation';
import { createSafeValidator } from '@whitewater-guide/validation';

const validator = createSafeValidator(RiverInputSchema);

type TestValue = [string, RiverInput];

const correct: RiverInput = {
  id: '7ce3319e-c264-11e8-a355-529269fb1459',
  name: 'foo',
  region: { id: '879ca106-c264-11e8-a355-529269fb1459' },
  altNames: ['bar', 'baz'],
};

const correctValues: TestValue[] = [
  ['full value', correct],
  [
    'null value',
    {
      ...correct,
      id: null,
      altNames: null,
      importId: null,
    },
  ],
  [
    'with import id',
    {
      ...correct,
      importId: 'green',
    },
  ],
];

const incorrectValues: TestValue[] = [
  ['bad uuid', { ...correct, id: 'foo' }],
  ['empty name', { ...correct, name: '' }],
  ['empty alt names', { ...correct, altNames: [''] }],
  ['bad region', { ...correct, region: { id: 'foo' } }],
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
