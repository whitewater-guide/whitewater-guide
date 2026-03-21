import type { RegionCoverImageMobileArgs } from '@whitewater-guide/schema';

import type { RegionCoverImageResolvers } from '../../../apollo/index';
import { Imgproxy } from '../../../s3/index';

export const coverImageResolvers: RegionCoverImageResolvers = {
  mobile: (coverImageRaw, { width }: RegionCoverImageMobileArgs) => {
    const mobile = coverImageRaw?.mobile;
    if (!mobile) {
      return null;
    }
    return Imgproxy.url(
      'covers',
      mobile,
      Imgproxy.getProcessingOpts(
        width,
        undefined,
        [2048, 1600, 1366, 1024, 768, 640],
      ),
    );
  },
};
