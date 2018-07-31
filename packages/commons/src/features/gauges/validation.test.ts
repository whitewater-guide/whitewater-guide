import { createValidator } from '../../utils/validation';
import { GaugeInput } from './types';
import { GaugeInputStruct } from './validation';

const validator = createValidator(GaugeInputStruct);

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

it.each(correctValues)('should be valid for %s', (_, value) => {
  expect(validator(value)).toBeNull();
});

it('should produce error on incorrect input', () => {
  const badGauge: GaugeInput = {
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
    requestParams: { },
    cron: '-1 * * * *',
    url: 'http://google.',
    source: {
      id: 'bar',
    },
  };
  expect(validator(badGauge)).toMatchSnapshot();
});
