import { FieldResolvers } from '@apollo';
import { timestampResolvers } from '@db';
import { Imgproxy } from '@utils';
import { Media, MediaKind } from '@whitewater-guide/commons';
import { ImageArgs, MediaRaw } from '../types';

const WHITELIST = [
  { height: 180 }, // web thumbs
];

const mediaFieldResolvers: FieldResolvers<MediaRaw, Media> = {
  ...timestampResolvers,
  deleted: ({ deleted }) => !!deleted,
  image: ({ kind, url }, { width, height }: ImageArgs) => {
    if (kind === MediaKind.photo) {
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
