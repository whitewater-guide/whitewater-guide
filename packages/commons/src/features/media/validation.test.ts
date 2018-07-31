import { createValidator } from '../../utils/validation';
import { MediaInput, MediaKind } from './types';
import { MediaInputStruct } from './validation';

const validator = createValidator(MediaInputStruct);

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
  [
    'full value',
    correct,
  ],
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
  [
    'bad uuid',
    { ...correct, id: 'fooo' },
  ],
  [
    'empty url',
    { ...correct, url: '' },
  ],
  [
    'bad kind',
    { ...correct, kind: 'foo' as any },
  ],
  [
    'bad resolution 1',
    { ...correct, resolution: [] },
  ],
  [
    'bad resolution 2',
    { ...correct, resolution: [11] },
  ],
  [
    'bad resolution 3',
    { ...correct, resolution: [-100, 100] },
  ],
  [
    'bad resolution 4',
    { ...correct, resolution: [12.3, 11] },
  ],
  [
    'bad weight',
    { ...correct, weight: 12.3 },
  ],
];

it.each(correctValues)('should be valid for %s', (_, value) => {
  expect(validator(value)).toBeNull();
});

it.each(incorrectValues)('should be invalid for %s', (_, value) => {
  expect(validator(value)).not.toBeNull();
  expect(validator(value)).toMatchSnapshot();
});
