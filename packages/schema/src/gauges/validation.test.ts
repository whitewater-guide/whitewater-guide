import { createSafeValidator } from '@whitewater-guide/validation';

import { GaugeInput } from '../__generated__/types';
import { GaugeInputSchema } from './validation';

const validator = createSafeValidator(GaugeInputSchema);

type TestValue = [string, GaugeInput];
type IncorrectTestValue = [string, any];

const required: GaugeInput = {
  name: 'Gauge',
  code: 'g001',
  source: {
    id: '7df5722e-2d30-4993-890b-c062de184f78',
  },
};

const gauge: GaugeInput = {
  ...required,
  id: '712fcc21-6d0b-475a-bf53-2cb1892767fc',
  levelUnit: 'm',
  flowUnit: 'm3/s',
  location: {
    id: '28de619b-a05b-430d-b835-527183b4f1dd',
    name: 'Gauge g001',
    description: null,
    coordinates: [-170, 80, 123.5],
    kind: 'gauge',
  },
  requestParams: { foo: 'bar' },
  url: 'http://google.com',
  timezone: 'Europe/Moscow',
};

const correctValues: TestValue[] = [
  ['full value', gauge],
  ['only required fields', required],
  [
    'nulled value',
    {
      ...gauge,
      id: null,
      levelUnit: null,
      flowUnit: null,
      location: null,
      requestParams: null,
      url: null,
      timezone: null,
    },
  ],
  [
    'value with empty string url',
    {
      ...gauge,
      url: '',
    },
  ],
];

const incorrectValues: IncorrectTestValue[] = [
  [
    'all',
    {
      id: 'aaaa',
      name: '',
      code: '',
      levelUnit: '',
      flowUnit: '',
      location: {
        id: 'zzz',
        name: 'z',
        description: null,
        coordinates: [-190, 800, -123.5],
        kind: 'foo',
      },
      requestParams: {},
      url: 'http://google.',
      source: {
        id: 'bar',
      },
    },
  ],
  ['undefined name', { ...gauge, name: undefined }],
  ['undefined code', { ...gauge, code: undefined }],
  ['undefined source', { ...gauge, source: undefined }],
  ['null source', { ...gauge, source: null }],
  ['extra field', { ...gauge, foo: 'bar' }],
];

it.each(correctValues)('should be valid for %s', (_, value) => {
  expect(validator(value)).toBeNull();
});

it.each(incorrectValues)('should be invalid for %s', (_, value) => {
  const error = validator(value);
  expect(error).not.toBeNull();
  expect(error).toMatchSnapshot();
});
