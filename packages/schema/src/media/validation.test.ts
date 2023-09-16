import { createSafeValidator } from '@whitewater-guide/validation';

import type { MediaInput } from '../__generated__/types';
import { MediaKind } from '../__generated__/types';
import { MediaInputSchema } from './validation';

const validator = createSafeValidator(MediaInputSchema);

type TestValue = [string, MediaInput];
type IncorrectTestValue = [string, any];

const required: MediaInput = {
  kind: MediaKind.Photo,
  url: 'https://ya.ru/pic.png',
};

const correct: MediaInput = {
  ...required,
  id: '9f0ff4b6-c258-11e8-a355-529269fb1459',
  description: 'description',
  resolution: [800, 600],
  weight: -3,
  copyright: 'Copyright',
  license: {
    slug: 'CC_BY-SA',
    name: 'Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)',
    url: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
};

const correctValues: TestValue[] = [
  ['full value', correct],
  ['required fields only', required],
  [
    'null value',
    {
      id: null,
      description: null,
      copyright: null,
      license: null,
      weight: null,
      resolution: null,
      url: 'https://ya.ru',
      kind: MediaKind.Photo,
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

const incorrectValues: IncorrectTestValue[] = [
  ['bad uuid', { ...correct, id: 'fooo' }],
  ['empty url', { ...correct, url: '' }],
  ['undefined url', { ...correct, url: undefined }],
  ['bad kind', { ...correct, kind: 'foo' }],
  ['bad resolution 1', { ...correct, resolution: [] }],
  ['bad resolution 2', { ...correct, resolution: [11] }],
  ['bad resolution 3', { ...correct, resolution: [-100, 100] }],
  ['bad resolution 4', { ...correct, resolution: [12.3, 11] }],
  ['bad weight', { ...correct, weight: 12.3 }],
  ['extra fields', { ...correct, foo: 'bar' }],
];

it.each(correctValues)('should be valid for %s', (_, value) => {
  expect(validator(value)).toBeNull();
});

it.each(incorrectValues)('should be invalid for %s', (_, value) => {
  expect(validator(value)).not.toBeNull();
  expect(validator(value)).toMatchSnapshot();
});
