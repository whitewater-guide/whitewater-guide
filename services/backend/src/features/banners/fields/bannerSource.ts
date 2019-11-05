import { FieldResolvers } from '@apollo';
import { Imgproxy } from '@utils';
import { BannerKind, BannerSource } from '@whitewater-guide/commons';
import { BannerSourceArgs, BannerSourceRaw } from '../types';

export const bannerSourceResolvers: FieldResolvers<
  BannerSourceRaw,
  BannerSource
> = {
  // @deprecated, keep for old clients
  // @ts-ignore
  src: (raw, { width }: BannerSourceArgs, context) => {
    const { kind, url, src } = raw;
    const realURL = url || src;
    if (kind === BannerKind.WebView || context.legacy) {
      return realURL;
    }
    return Imgproxy.url(
      'banners',
      realURL,
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
  url: (raw, { width }: BannerSourceArgs, context) => {
    const { kind, url, src } = raw;
    const realURL = url || src;
    if (kind === BannerKind.WebView || context.legacy) {
      return realURL;
    }
    return Imgproxy.url(
      'banners',
      realURL!,
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
  // @deprecated
  ratio: ({ ratio }) => ratio || 1,
};
