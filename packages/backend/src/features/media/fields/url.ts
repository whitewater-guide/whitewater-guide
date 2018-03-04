import { GraphQLFieldResolver } from 'graphql';
import { Context } from '../../../apollo';
import { MEDIA_BUCKET_URL } from '../../../minio';
import { MediaRaw } from '../types';

const urlResolver: GraphQLFieldResolver<MediaRaw, Context> = ({ url }) =>
  url.includes('/') ? url : `${MEDIA_BUCKET_URL}/${url}`;

export default urlResolver;
