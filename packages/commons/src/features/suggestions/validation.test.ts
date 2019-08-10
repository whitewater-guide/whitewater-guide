import { createSafeValidator } from '../../validation';
import { SuggestionInput } from './types';
import { SuggestionInputSchema } from './validation';

const validator = createSafeValidator(SuggestionInputSchema);

type TestValue = [string, SuggestionInput];

const correct: SuggestionInput = {
  section: { id: '45bcd1fc-b5de-11e9-a2a3-2a2ae2dbcce4' },
  description: 'descr',
  copyright: 'copyright',
  filename: null,
  resolution: null,
};

const correctValues: TestValue[] = [
  ['without media', correct],
  [
    'with media',
    {
      ...correct,
      filename: 'fooo.jpg',
      resolution: [100, 100],
    },
  ],
  [
    'just media',
    {
      ...correct,
      description: null,
      copyright: null,
      filename: 'fooo.jpg',
      resolution: [100, 100],
    },
  ],
];

const incorrectValues: TestValue[] = [
  ['bad uuid', { ...correct, section: { id: 'fooo' } }],
  ['no description and no media', { ...correct, description: null }],
  ['filename without resolution', { ...correct, filename: 'foo.jpg' }],
  ['resolution without filename', { ...correct, resolution: [100, 100] }],
  [
    'bad resolution',
    { ...correct, filename: 'foo.jpg', resolution: [100, 100, 100] },
  ],
  ['extra fields', { ...correct, foo: 'bar' } as any],
];

it.each(correctValues)('should be valid for %s', (_, value) => {
  expect(validator(value)).toBeNull();
});

it.each(incorrectValues)('should be invalid for %s', (_, value) => {
  expect(validator(value)).not.toBeNull();
  expect(validator(value)).toMatchSnapshot();
});
