import { FieldResolvers } from '@apollo';
import { Imgproxy } from '@utils';
import { RegionCoverImage } from '@whitewater-guide/commons';
import { CoverArgs, CoverImageRaw } from '../types';

export const coverImageResolvers: FieldResolvers<
  CoverImageRaw,
  RegionCoverImage
> = {
  mobile: (coverImageRaw, { width }: CoverArgs, context) => {
    const mobile = coverImageRaw && coverImageRaw.mobile;
    if (!mobile) {
      return null;
    }
    if (context.legacy) {
      return mobile;
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
