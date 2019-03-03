import { FieldResolvers } from '@apollo';
import { Imgproxy } from '@utils';
import { BannerKind, BannerSource } from '@whitewater-guide/commons';
import { BannerSourceArgs } from '../types';

export const bannerSourceResolvers: FieldResolvers<
  BannerSource,
  BannerSource
> = {
  src: (raw, { width }: BannerSourceArgs, context) => {
    const { kind, src } = raw;
    if (kind === BannerKind.WebView || context.legacy) {
      return src;
    }
    return Imgproxy.url(
      'banners',
      src,
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
