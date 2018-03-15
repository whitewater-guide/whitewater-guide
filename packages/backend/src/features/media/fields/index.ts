import { FieldResolvers } from '../../../apollo';
import { timestampResolvers } from '../../../db';
import { Media } from '../../../ww-commons';
import { MediaRaw } from '../types';
import thumb from './thumb';
import url from './url';

const mediaFieldResolvers: FieldResolvers<MediaRaw, Media> = {
  ...timestampResolvers,
  deleted: ({ deleted }) => !!deleted,
  thumb,
  url,
};

export default mediaFieldResolvers;
