import { RegionCoverImage } from '@whitewater-guide/commons';

import { FieldResolvers } from '~/apollo';
import { Imgproxy } from '~/s3';

import { CoverArgs, CoverImageRaw } from '../types';

export const coverImageResolvers: FieldResolvers<
  CoverImageRaw,
  RegionCoverImage
> = {
  mobile: (coverImageRaw, { width }: CoverArgs) => {
    const mobile = coverImageRaw && coverImageRaw.mobile;
    if (!mobile) {
      return null;
    }
    return Imgproxy.url(
      'covers',
      mobile,
      Imgproxy.getProcessingOpts(width, undefined, [
        2048,
        1600,
        1366,
        1024,
        768,
        640,
      ]),
    );
  },
};
