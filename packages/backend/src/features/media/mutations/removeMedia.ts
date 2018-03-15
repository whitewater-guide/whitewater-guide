import { GraphQLFieldResolver } from 'graphql';
import { isAdminResolver } from '../../../apollo';
import db from '../../../db';
import { MEDIA, minioClient } from '../../../minio';
import { MediaKind } from '../../../ww-commons';

interface RemoveVariables {
  id: string;
}

const resolver: GraphQLFieldResolver<any, any> = async (root, { id }: RemoveVariables) => {
  const [result] = await db().table('media').del().where({ id }).returning(['id', 'url', 'kind']);
  if (result.kind === MediaKind.photo && result.url && !result.url.startsWith('http')) {
    await minioClient.removeObject(MEDIA, result.url);
  }
  return {
    id: result.id,
    language: 'en', // TODO: context lang
    deleted: true,
  };
};

const removeMedia = isAdminResolver.createResolver(
  resolver,
);

export default removeMedia;
