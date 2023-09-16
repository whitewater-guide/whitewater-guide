import { createSafeValidator } from '@whitewater-guide/validation';

import type { TagInput } from '../__generated__/types';
import { TagCategory } from '../__generated__/types';
import { TagInputSchema } from './validation';

const validator = createSafeValidator(TagInputSchema);

type TestValue = [string, TagInput];
type IncorrectTestValue = [string, any];

const correct: TagInput = {
  id: 'sometag',
  name: 'Some tag',
  category: TagCategory.Hazards,
};

const correctValues: TestValue[] = [
  ['full value', correct],
  ['legacy id 1', { ...correct, id: 'Must-run' }],
  ['legacy id 2', { ...correct, id: 'man_made' }],
  ['legacy id 3', { ...correct, id: '4x4' }],
];

const incorrectValues: IncorrectTestValue[] = [
  ['empty name', { ...correct, name: '' }],
  ['bad category', { ...correct, category: 'foo' }],
  ['bad id 1', { ...correct, id: 'aa' }],
  ['bad id 2', { ...correct, id: 'яяяяяя' }],
  ['bad id 3', { ...correct, id: 'foo bar' }],
  ['extra fields', { ...correct, foo: 'foo bar' }],
];

it.each(correctValues)('should be valid for %s', (_, value) => {
  expect(validator(value)).toBeNull();
});

it.each(incorrectValues)('should be invalid for %s', (_, value) => {
  const error = validator(value);
  expect(error).not.toBeNull();
  expect(error).toMatchSnapshot();
});
