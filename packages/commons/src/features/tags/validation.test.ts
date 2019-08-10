import { createSafeValidator } from '../../validation';
import { TagCategory, TagInput } from './types';
import { TagInputSchema } from './validation';

const validator = createSafeValidator(TagInputSchema);

type TestValue = [string, TagInput];

const correct: TagInput = {
  id: 'sometag',
  name: 'Some tag',
  category: TagCategory.hazards,
};

const correctValues: TestValue[] = [
  ['full value', correct],
  ['legacy id 1', { ...correct, id: 'Must-run' }],
  ['legacy id 2', { ...correct, id: 'man_made' }],
  ['legacy id 3', { ...correct, id: '4x4' }],
];

const incorrectValues: TestValue[] = [
  ['empty name', { ...correct, name: '' }],
  ['bad category', { ...correct, category: 'foo' as any }],
  ['bad id 1', { ...correct, id: 'aa' }],
  ['bad id 2', { ...correct, id: 'яяяяяя' }],
  ['bad id 3', { ...correct, id: 'foo bar' }],
  ['extra fields', { ...correct, foo: 'foo bar' } as any],
];

it.each(correctValues)('should be valid for %s', (_, value) => {
  expect(validator(value)).toBeNull();
});

it.each(incorrectValues)('should be invalid for %s', (_, value) => {
  const error = validator(value);
  expect(error).not.toBeNull();
  expect(error).toMatchSnapshot();
});
