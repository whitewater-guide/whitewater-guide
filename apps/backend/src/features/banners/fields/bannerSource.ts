import type {
  BannerSourceSrcArgs,
  BannerSourceUrlArgs,
} from '@whitewater-guide/schema';
import { BannerKind } from '@whitewater-guide/schema';

import type { BannerSourceResolvers } from '../../../apollo/index';
import { Imgproxy } from '../../../s3/index';

export const bannerSourceResolvers: BannerSourceResolvers = {
  // @deprecated, keep for old clients
  src: (raw, { width }: BannerSourceSrcArgs) => {
    const { kind, url } = raw;
    if (kind === BannerKind.WebView) {
      return url;
    }
    return Imgproxy.url(
      'banners',
      url,
      Imgproxy.getProcessingOpts(
        width,
        undefined,
        [2048, 1600, 1366, 1024, 768, 640],
      ),
    );
  },
  url: (raw, { width }: BannerSourceUrlArgs) => {
    const { kind, url } = raw;
    if (kind === BannerKind.WebView) {
      return url;
    }
    return Imgproxy.url(
      'banners',
      url,
      Imgproxy.getProcessingOpts(
        width,
        undefined,
        [2048, 1600, 1366, 1024, 768, 640],
      ),
    );
  },
  // @deprecated
  ratio: () => 1,
};
