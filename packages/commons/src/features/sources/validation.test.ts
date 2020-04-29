import { SourceInput } from './types';
import { SourceInputSchema } from './validation';
import { createSafeValidator } from '@whitewater-guide/validation';

describe('SourceInput', () => {
  const validator = createSafeValidator(SourceInputSchema);

  type TestValue = [string, SourceInput];

  const correct: SourceInput = {
    id: 'fd78e364-c2e4-11e8-a355-529269fb1459',
    name: 'src',
    cron: '10 * * * *',
    regions: [{ id: '1750c41e-c2e5-11e8-a355-529269fb1459' }],
    script: 'script',
    termsOfUse: 'terms of use',
    requestParams: { foo: 'bar' },
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
        regions: [],
        script: 'script',
        termsOfUse: null,
        requestParams: null,
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
    ['extra fields', { ...correct, foo: 'foo' } as any],
  ];

  it.each(correctValues)('should be valid for %s', (_, value) => {
    expect(validator(value)).toBeNull();
  });

  it.each(incorrectValues)('should be invalid for %s', (_, value) => {
    const error = validator(value);
    expect(error).not.toBeNull();
    expect(error).toMatchSnapshot();
  });
});
