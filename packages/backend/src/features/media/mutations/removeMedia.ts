import { GraphQLFieldResolver } from 'graphql';
import { baseResolver } from '../../../apollo';
import db from '../../../db';
import { MEDIA, minioClient } from '../../../minio';
import { MediaKind } from '../../../ww-commons';

interface Vars {
  id: string;
}

const resolver: GraphQLFieldResolver<any, any> = async (root, { id }: Vars) => {
  const [result] = await db().table('media').del().where({ id }).returning(['id', 'url', 'kind']);
  if (result.kind === MediaKind.photo && result.url && !result.url.startsWith('http')) {
    await minioClient.removeObject(MEDIA, result.url);
  }
  return {
    id: result.id,
    deleted: true,
  };
};

const removeMedia = baseResolver.createResolver(
  resolver,
);

export default removeMedia;
