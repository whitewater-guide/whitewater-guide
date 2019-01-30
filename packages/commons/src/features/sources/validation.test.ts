import { createValidator } from '../../utils/validation';
import { HarvestMode } from '../harvest-mode';
import { SourceFormInput, SourceInput } from './types';
import { SourceFormStruct, SourceInputStruct } from './validation';

describe('SourceInput', () => {
  const validator = createValidator(SourceInputStruct);

  type TestValue = [string, SourceInput];

  const correct: SourceInput = {
    id: 'fd78e364-c2e4-11e8-a355-529269fb1459',
    name: 'src',
    cron: '10 * * * *',
    harvestMode: HarvestMode.ALL_AT_ONCE,
    regions: [{ id: '1750c41e-c2e5-11e8-a355-529269fb1459' }],
    script: 'script',
    termsOfUse: 'terms of use',
    url: 'http://ya.ru',
  };

  const correctValues: TestValue[] = [
    ['full value', correct],
    [
      'nulled value',
      {
        id: null,
        name: 'source',
        cron: null,
        harvestMode: HarvestMode.ALL_AT_ONCE,
        regions: [],
        script: 'script',
        termsOfUse: null,
        url: null,
      },
    ],
    ['empty termsOfUse', { ...correct, termsOfUse: '' }],
    ['empty cron', { ...correct, cron: '' }],
    ['empty url', { ...correct, url: '' }],
  ];

  const incorrectValues: TestValue[] = [
    ['bad uuid', { ...correct, id: 'foo' }],
    ['empty name', { ...correct, name: '' }],
    ['empty script', { ...correct, script: '' }],
    ['bad cron', { ...correct, cron: '100 * * * * *' }],
    ['bad harvest_mode', { ...correct, harvestMode: 'foo' as any }],
    ['bad url', { ...correct, url: 'foo' }],
    ['bad region', { ...correct, regions: [{ id: 'foo' }] }],
    [
      'some bad regions legacy snapshot',
      {
        ...correct,
        regions: [
          { id: 'foo' },
          { id: '1750c41e-c2e5-11e8-a355-529269fb1459' },
          { id: 'bar' },
        ],
      },
    ],
  ];

  it.each(correctValues)('should be valid for %s', (_, value) => {
    expect(validator(value)).toBeNull();
  });

  it.each(incorrectValues)('should be invalid for %s', (_, value) => {
    expect(validator(value)).not.toBeNull();
    expect(validator(value)).toMatchSnapshot();
  });
});

describe('SourceForm', () => {
  const validator = createValidator(SourceFormStruct());

  interface TestRichText {
    markdown: string;
    prosemirror: { state: string };
  }

  type SFI = SourceFormInput<TestRichText | null>;
  type TestValue = [string, SFI];

  const correct: SFI = {
    id: 'fd78e364-c2e4-11e8-a355-529269fb1459',
    name: 'src',
    cron: '10 * * * *',
    harvestMode: HarvestMode.ALL_AT_ONCE,
    regions: [{ id: '1750c41e-c2e5-11e8-a355-529269fb1459' }],
    script: {
      id: 'galicia2',
      name: 'Galicia 2',
      harvestMode: HarvestMode.ONE_BY_ONE,
      error: null,
    },
    termsOfUse: {
      markdown: 'foo',
      prosemirror: { state: 'foo' },
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
        termsOfUse: null,
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
          harvestMode: 'foo' as any,
          error: null,
        },
      },
    ],
    ['bad cron', { ...correct, cron: '100 * * * * *' }],
    ['bad harvest_mode', { ...correct, harvestMode: 'foo' as any }],
    ['bad url', { ...correct, url: 'foo' }],
    ['bad region', { ...correct, regions: [{ id: 'foo' }] }],
    [
      'some bad regions legacy snapshot',
      {
        ...correct,
        regions: [
          { id: 'foo' },
          { id: '1750c41e-c2e5-11e8-a355-529269fb1459' },
          { id: 'bar' },
        ],
      },
    ],
  ];

  it.each(correctValues)('should be valid for %s', (_, value) => {
    expect(validator(value)).toBeNull();
  });

  it.each(incorrectValues)('should be invalid for %s', (_, value) => {
    expect(validator(value)).not.toBeNull();
    expect(validator(value)).toMatchSnapshot();
  });
});
