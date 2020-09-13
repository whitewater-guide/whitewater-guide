import { createSafeValidator } from '@whitewater-guide/validation';

import { MediaInput, MediaKind } from './types';
import { MediaInputSchema } from './validation';

const validator = createSafeValidator(MediaInputSchema);

type TestValue = [string, MediaInput];

const correct: MediaInput = {
  id: '9f0ff4b6-c258-11e8-a355-529269fb1459',
  description: 'description',
  kind: MediaKind.photo,
  resolution: [800, 600],
  url: 'jhakjfh',
  weight: -3,
  copyright: 'Copyright',
};

const correctValues: TestValue[] = [
  ['full value', correct],
  [
    'null value',
    {
      id: null,
      description: null,
      copyright: null,
      weight: null,
      resolution: null,
      url: 'https://ya.ru',
      kind: MediaKind.photo,
    },
  ],
  [
    'empty string as description and copyright',
    {
      ...correct,
      description: '',
      copyright: '',
    },
  ],
];

const incorrectValues: TestValue[] = [
  ['bad uuid', { ...correct, id: 'fooo' }],
  ['undefined uuid', { ...correct, id: undefined as any }],
  ['empty url', { ...correct, url: '' }],
  ['undefined url', { ...correct, url: undefined as any }],
  ['bad kind', { ...correct, kind: 'foo' as any }],
  ['undefined resolution', { ...correct, resolution: undefined as any }],
  ['bad resolution 1', { ...correct, resolution: [] }],
  ['bad resolution 2', { ...correct, resolution: [11] }],
  ['bad resolution 3', { ...correct, resolution: [-100, 100] }],
  ['bad resolution 4', { ...correct, resolution: [12.3, 11] }],
  ['bad weight', { ...correct, weight: 12.3 }],
  ['extra fields', { ...correct, foo: 'bar' } as any],
];

it.each(correctValues)('should be valid for %s', (_, value) => {
  expect(validator(value)).toBeNull();
});

it.each(incorrectValues)('should be invalid for %s', (_, value) => {
  expect(validator(value)).not.toBeNull();
  expect(validator(value)).toMatchSnapshot();
});
