import { MediaImageArgs, MediaKind } from '@whitewater-guide/schema';

import { MediaResolvers, timestampedResolvers } from '~/apollo';
import { Imgproxy } from '~/s3';

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
