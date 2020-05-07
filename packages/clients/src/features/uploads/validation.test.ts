import { LocalPhoto, LocalPhotoStatus } from './types';

import { DeepPartial } from 'utility-types';
import { createSafeValidator } from '@whitewater-guide/validation';
import deepmerge from 'deepmerge';
import { getLocalPhotoSchema } from './validation';

type Cases = Array<[string, DeepPartial<LocalPhoto>, any]>;

const full: LocalPhoto = {
  id: 'h4xciTUq',
  file: {
    name: 'IMG_0009.JPG',
    type: 'image/jpeg',
  },
  status: LocalPhotoStatus.READY,
  url: 'https://s3.beta.whitewater.guide/temp/2b5527b27ef2.JPG',
  resolution: [2000, 2000],
};

describe('simple schema', () => {
  const SimpleSchema = getLocalPhotoSchema();
  const validator = createSafeValidator(SimpleSchema);

  it('should be valid for remote photo', () => {
    expect(
      validator({
        url: 'https://s3.beta.whitewater.guide/temp/2b5527b27ef2.JPG',
        resolution: [2000, 2000],
        status: LocalPhotoStatus.READY,
      }),
    ).toBeNull();
  });

  it('should be valid with extra attributes', () => {
    expect(
      validator({
        ...full,
        foo: 'bar',
      }),
    ).toBeNull();
  });

  const cases: Cases = [
    ['valid for full', {}, null],
    ['invalid for no url', { url: '' }, 'yup:photo.invalidURL'],
    [
      'invalid for invalid resolution',
      { resolution: [1, 2, 3] },
      'yup:photo.invalidResolution',
    ],
  ];

  it.each(cases)('should be %s value', (_, part, result) => {
    expect(validator(deepmerge(full, part))).toEqual(
      result === null ? null : { undefined: result },
    );
  });
});

it('should be valid for no url schema', () => {
  const NoUrlSchema = getLocalPhotoSchema({ urlRequired: false });
  const validator = createSafeValidator(NoUrlSchema);
  const { url, ...rest } = full;
  expect(validator(rest)).toBeNull();
});

it('should be invalid for schema with mpx limit', () => {
  const MpxLimitSchema = getLocalPhotoSchema({ mpxOrResolution: 1 });
  const validator = createSafeValidator(MpxLimitSchema);
  expect(validator(full)).toEqual({
    undefined: {
      key: 'yup:photo.megapixels',
      options: { mpx: 1 },
    },
  });
});

it('should be invalid for schema with resolution limit', () => {
  const MpxLimitSchema = getLocalPhotoSchema({ mpxOrResolution: [1000, 1000] });
  const validator = createSafeValidator(MpxLimitSchema);
  expect(validator(full)).toEqual({
    undefined: {
      key: 'yup:photo.resolution',
      options: { width: 1000, height: 1000 },
    },
  });
});

it('should allow nulls', () => {
  const MpxLimitSchema = getLocalPhotoSchema({ nullable: true });
  const validator = createSafeValidator(MpxLimitSchema);
  expect(validator(null)).toBeNull();
});
