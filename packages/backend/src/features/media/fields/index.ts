import { FieldResolvers } from '../../../apollo';
import { timestampResolvers } from '../../../db';
import { Media } from '../../../ww-commons';
import { MediaRaw } from '../types';

const mediaFieldResolvers: FieldResolvers<MediaRaw, Media> = {
  ...timestampResolvers,
  deleted: ({ deleted }) => !!deleted,
};

export default mediaFieldResolvers;
