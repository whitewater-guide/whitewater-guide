import { createSafeValidator } from '@whitewater-guide/validation';

import type { BannerInput } from '../__generated__/types';
import { BannerKind, BannerPlacement } from '../__generated__/types';
import { BannerInputSchema } from './validation';

type TestValue = [string, BannerInput];
type IncorrectTestValue = [string, any];
const validator = createSafeValidator(BannerInputSchema);

const required: BannerInput = {
  slug: 'test_banner',
  name: 'Some banner',
  priority: 10,
  enabled: true,
  placement: BannerPlacement.MobileRegionDescription,
  source: {
    kind: BannerKind.WebView,
    url: 'https://banner.com',
  },
  regions: [{ id: 'd10c02b6-c659-11e8-a355-529269fb1459' }],
  groups: [{ id: 'db178622-c659-11e8-a355-529269fb1459' }],
};

const correct: BannerInput = {
  ...required,
  id: 'dddf9d28-c251-11e8-a355-529269fb1459',
  link: 'https://yamdex.ru',
  extras: { foo: 'bar' },
};

const correctValues: TestValue[] = [
  ['full value', correct],
  ['only required fields', required],
  ['null value', { ...correct, id: null, link: null, extras: null }],
  [
    'image source',
    {
      ...correct,
      source: {
        kind: BannerKind.Image,
        url: 'banner_file',
      },
    },
  ],
  ['empty regions', { ...correct, regions: [] }],
  ['empty groups', { ...correct, groups: [] }],
];

const incorrectValues: IncorrectTestValue[] = [
  ['bad uuid', { ...correct, id: 'foo' }],
  ['casting priority', { ...correct, priority: '10' }],
  ['empty name', { ...correct, name: '' }],
  ['bad slug 1', { ...correct, slug: 'a' }],
  ['bad slug 2', { ...correct, slug: 'ешкин крот' }],
  [
    'empty source',
    { ...correct, source: { kind: BannerKind.WebView, ratio: 4, src: '' } },
  ],
  [
    'source with extra fields',
    {
      ...correct,
      source: {
        kind: BannerKind.WebView,
        ratio: 4,
        url: 'https://ya.ru',
        foo: 'bar',
      },
    },
  ],
  ['bad link', { ...correct, link: 'hey' }],
  ['http link', { ...correct, link: 'http://ya.ru' }],
  ['bad placement', { ...correct, placement: 'nowhere' }],
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
  ['extra fields', { ...correct, foo: 'bar' }],
];

it.each(correctValues)('should be valid for %s', (_, value) => {
  expect(validator(value)).toBeNull();
});

it.each(incorrectValues)('should be invalid for %s', (_, value) => {
  expect(validator(value)).not.toBeNull();
  expect(validator(value)).toMatchSnapshot();
});
