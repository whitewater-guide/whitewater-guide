import type { MediaImageArgs } from '@whitewater-guide/schema';
import { MediaKind } from '@whitewater-guide/schema';

import type { MediaResolvers } from '../../../apollo/index';
import { timestampedResolvers } from '../../../apollo/index';
import { Imgproxy } from '../../../s3/index';

const WHITELIST = [
  { height: 180 }, // web thumbs
];

const mediaFieldResolvers: MediaResolvers = {
  ...timestampedResolvers,
  deleted: ({ deleted }: any) => !!deleted,
  url: ({ kind, url }) => {
    if (kind === MediaKind.Photo) {
      return Imgproxy.url('media', url, null);
    }
    return url;
  },
  image: ({ kind, url }, { width, height }: MediaImageArgs) => {
    if (kind === MediaKind.Photo) {
      return Imgproxy.url(
        'media',
        url,
        Imgproxy.getProcessingOpts(width, height, 100, WHITELIST),
      );
    }
    return null;
  },
};

export default mediaFieldResolvers;
