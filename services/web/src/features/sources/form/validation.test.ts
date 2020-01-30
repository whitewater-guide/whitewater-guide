import { createSafeValidator } from '@whitewater-guide/commons';
import { SourceFormData } from './types';
import SourceFormSchema from './validation';

const validator = createSafeValidator(SourceFormSchema);

type TestValue = [string, SourceFormData];

const correct: SourceFormData = {
  id: 'fd78e364-c2e4-11e8-a355-529269fb1459',
  name: 'src',
  requestParams: '{ "foo": "bar" }',
  cron: '10 * * * *',
  regions: [{ id: '1750c41e-c2e5-11e8-a355-529269fb1459', name: 'region' }],
  script: {
    id: 'galicia2',
    name: 'Galicia 2',
  },
  termsOfUse: {
    markdown: 'foo',
    prosemirror: { state: 'foo' } as any,
    isMarkdown: true,
  },
  url: 'http://ya.ru',
};

const correctValues: TestValue[] = [
  ['full value', correct],
  [
    'nulled value',
    {
      ...correct,
      id: null,
      cron: null,
      requestParams: null,
      url: null,
    },
  ],
  ['empty cron', { ...correct, cron: '' }],
  ['empty url', { ...correct, url: '' }],
];

const incorrectValues: TestValue[] = [
  ['bad uuid', { ...correct, id: 'foo' }],
  ['empty name', { ...correct, name: '' }],
  [
    'bad script',
    {
      ...correct,
      script: {
        id: '',
        name: '',
      },
    },
  ],
  ['bad cron', { ...correct, cron: '100 * * * * *' }],
  ['bad url', { ...correct, url: 'foo' }],
  ['bad region', { ...correct, regions: [{ id: 'foo', name: 'region' }] }],
  [
    'some bad regions legacy snapshot',
    {
      ...correct,
      regions: [
        { id: 'foo', name: 'region' },
        { id: '1750c41e-c2e5-11e8-a355-529269fb1459', name: 'region' },
        { id: 'bar', name: 'region' },
      ],
    },
  ],
];

it.each(correctValues)('should be valid for %s', (_, value) => {
  expect(validator(value)).toBeNull();
});

it.each(incorrectValues)('should be invalid for %s', (_, value) => {
  const error = validator(value);
  expect(error).not.toBeNull();
  expect(error).toMatchSnapshot();
});
