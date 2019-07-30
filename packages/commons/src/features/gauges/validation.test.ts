import { createSafeValidator } from '../../validation';
import { GaugeInput } from './types';
import { GaugeInputSchema } from './validation';

const validator = createSafeValidator(GaugeInputSchema);

type TestValue = [string, GaugeInput];

const gauge: GaugeInput = {
  id: '712fcc21-6d0b-475a-bf53-2cb1892767fc',
  name: 'Gauge',
  code: 'g001',
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
  cron: '8 * * * *',
  url: 'http://google.com',
  source: {
    id: '7df5722e-2d30-4993-890b-c062de184f78',
  },
};

const correctValues: TestValue[] = [
  ['full value', gauge],
  [
    'minimal value',
    {
      ...gauge,
      id: null,
      levelUnit: null,
      flowUnit: null,
      location: null,
      requestParams: null,
      cron: null,
      url: null,
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

const incorrectValues: TestValue[] = [
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
      cron: '-1 * * * *',
      url: 'http://google.',
      source: {
        id: 'bar',
      },
    },
  ],
  ['undefined name', { ...gauge, name: undefined as any }],
  ['undefined code', { ...gauge, code: undefined as any }],
  ['undefined cron', { ...gauge, cron: undefined as any }],
  ['undefined level unit', { ...gauge, levelUnit: undefined as any }],
  ['undefined request params', { ...gauge, requestParams: undefined as any }],
  ['undefined source', { ...gauge, source: undefined as any }],
  ['null source', { ...gauge, source: null as any }],
  ['extra field', { ...gauge, foo: 'bar' } as any],
];

it.each(correctValues)('should be valid for %s', (_, value) => {
  expect(validator(value)).toBeNull();
});

it.each(incorrectValues)('should be invalid for %s', (_, value) => {
  const error = validator(value);
  expect(error).not.toBeNull();
  expect(error).toMatchSnapshot();
});
