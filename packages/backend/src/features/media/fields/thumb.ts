import { GraphQLFieldResolver } from 'graphql';
import { Context } from '../../../apollo';
import { getThumb, MEDIA_BUCKET_URL } from '../../../minio';
import { ThumbOptions } from '../../../ww-commons';
import { MediaRaw } from '../types';

interface Options {
  options?: ThumbOptions;
}

const thumbResolver: GraphQLFieldResolver<MediaRaw, Context, Options> = ({ url }, args) =>
  getThumb(url.startsWith('http') ? url : `${MEDIA_BUCKET_URL}/${url}`, args.options);

export default thumbResolver;
