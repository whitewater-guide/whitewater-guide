import { LocalPhotoStatus } from '@whitewater-guide/clients';
import {
  BannerPlacement,
  BannerResolutions,
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
  source: 'https://banner.com',
  link: 'https://yamdex.ru',
  extras: '{ "foo": "bar" }',
  regions: [{ id: 'd10c02b6-c659-11e8-a355-529269fb1459', name: 'region' }],
  groups: [{ id: 'db178622-c659-11e8-a355-529269fb1459', name: 'group' }],
};

const correctValues: TestValue[] = [
  ['webview value', correct],
  [
    'local photo value',
    {
      ...correct,
      source: {
        id: 'foo',
        status: LocalPhotoStatus.READY,
        url: 'https://banner.com',
        resolution: BannerResolutions.get(
          BannerPlacement.MOBILE_REGION_DESCRIPTION,
        )!,
      },
    },
  ],
  ['null extras', { ...correct, extras: null }],
];

const incorrectValues: TestValue[] = [
  [
    'invalid resolution',
    {
      ...correct,
      source: {
        id: 'foo',
        status: LocalPhotoStatus.READY,
        url: 'https://banner.com',
        resolution: [100, 100],
      },
    },
  ],
];

it.each(correctValues)('should be valid for %s', (_, value) => {
  expect(validator(value)).toBeNull();
});

it.each(incorrectValues)('should be invalid for %s', (_, value) => {
  const result = validator(value);
  expect(result).not.toBeNull();
  expect(result).toMatchSnapshot();
});
