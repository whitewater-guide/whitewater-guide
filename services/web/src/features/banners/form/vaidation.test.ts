import {
  BannerKind,
  BannerPlacement,
  createSafeValidator,
} from '@whitewater-guide/commons';
import { BannerFormData } from './types';
import { BannerFormSchema } from './validation';

type TestValue = [string, BannerFormData];
const validator = createSafeValidator(BannerFormSchema);

const correct: BannerFormData = {
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
  regions: [{ id: 'd10c02b6-c659-11e8-a355-529269fb1459', name: 'region' }],
  groups: [{ id: 'db178622-c659-11e8-a355-529269fb1459', name: 'group' }],
};

const correctValues: TestValue[] = [
  ['full value', correct],
  ['null extras', { ...correct, extras: null }],
];

it.each(correctValues)('should be valid for %s', (_, value) => {
  expect(validator(value)).toBeNull();
});
