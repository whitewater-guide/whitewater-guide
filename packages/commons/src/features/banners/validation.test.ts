import { createValidator } from '../../utils/validation';
import { BannerFormInput, BannerInput, BannerKind, BannerPlacement } from './types';
import { BannerFormStruct, BannerInputStruct } from './validation';

describe('BannerInputStruct', () => {
  const validator = createValidator(BannerInputStruct);

  type TestValue = [string, BannerInput];

  const correct: BannerInput = {
    id: 'dddf9d28-c251-11e8-a355-529269fb1459',
    slug: 'test_banner',
    name: 'Some banner',
    priority: 10,
    enabled: true,
    placement: BannerPlacement.MOBILE_REGION_DESCRIPTION,
    source: {
      kind: BannerKind.WebView,
      ratio: 4,
      src: 'https://banner.com',
    },
    link: 'https://yamdex.ru',
    extras: { foo: 'bar' },
    regions: [{ id: 'd10c02b6-c659-11e8-a355-529269fb1459' }],
    groups: [{ id: 'db178622-c659-11e8-a355-529269fb1459' }],
  };

  const correctValues: TestValue[] = [
    [
      'full value',
      correct,
    ],
    [
      'null value',
      { ...correct, id: null, link: null, extras: null },
    ],
    [
      'image source',
      {
        ...correct,
        source: {
          kind: BannerKind.Image,
          ratio: null,
          src: 'banner_file',
        },
      },
    ],
    [
      'empty regions',
      { ...correct, regions: [] },
    ],
    [
      'empty groups',
      { ...correct, groups: [] },
    ],
  ];

  const incorrectValues: TestValue[] = [
    [
      'bad uuid',
      { ...correct, id: 'foo' },
    ],
    [
      'empty name',
      { ...correct, name: '' },
    ],
    [
      'bad slug 1',
      { ...correct, slug: 'a' },
    ],
    [
      'bad slug 2',
      { ...correct, slug: 'ешкин крот' },
    ],
    [
      'bad ratio',
      { ...correct, source: { kind: BannerKind.WebView, ratio: 1, src: 'https://ya.ru' } },
    ],
    [
      'empty source',
      { ...correct, source: { kind: BannerKind.WebView, ratio: 4, src: '' } },
    ],
    [
      'bad link',
      { ...correct, link: 'hey' },
    ],
    [
      'http link',
      { ...correct, link: 'http://ya.ru' },
    ],
    [
      'bad placement',
      { ...correct, placement: 'nowhere' as any },
    ],
    [
      'bad region',
      {
        ...correct,
        regions: [
          { id: 'bbba0b32-c65a-11e8-a355-529269fb1459' },
          { id: 'foo' },
          { id: 'c1812eba-c65a-11e8-a355-529269fb1459' },
        ],
      },
    ],
    [
      'bad group',
      {
        ...correct,
        regions: [
          { id: 'cc95f33a-c65a-11e8-a355-529269fb1459' },
          { id: 'foo' },
          { id: 'cf52c102-c65a-11e8-a355-529269fb1459' },
        ],
      },
    ],
    [
      'extra fields',
      { ...correct, foo: 'bar' } as any,
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

describe('BannerFormStruct', () => {
  const validator = createValidator(BannerFormStruct);

  type TestValue = [string, BannerFormInput];

  const correct: BannerFormInput = {
    id: 'dddf9d28-c251-11e8-a355-529269fb1459',
    slug: 'test_banner',
    name: 'Some banner',
    priority: 10,
    enabled: true,
    placement: BannerPlacement.MOBILE_REGION_DESCRIPTION,
    source: {
      kind: BannerKind.WebView,
      ratio: 4,
      src: 'https://banner.com',
    },
    link: 'https://yamdex.ru',
    extras: '{ "foo": "bar" }',
    regions: [{ id: 'd10c02b6-c659-11e8-a355-529269fb1459' }],
    groups: [{ id: 'db178622-c659-11e8-a355-529269fb1459' }],
  };

  it('should be valid for extras as JSON string', () => {
    expect(validator(correct)).toBeNull();
  });

});
