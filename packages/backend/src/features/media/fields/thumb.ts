import { GraphQLFieldResolver } from 'graphql';
import { Context } from '../../../apollo';
import { getThumb } from '../../../minio';
import { ThumbOptions } from '../../../ww-commons';
import { MediaRaw } from '../types';

interface Options {
  options?: ThumbOptions;
}

const thumbResolver: GraphQLFieldResolver<MediaRaw, Context, Options> = (media, args) =>
  getThumb(media.url, args.options);

export default thumbResolver;
