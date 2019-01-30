import { TopLevelResolver } from '@apollo';
import db from '@db';
import { MEDIA, minioClient } from '@minio';
import { MediaKind } from '@whitewater-guide/commons';

interface Vars {
  id: string;
}

const removeMedia: TopLevelResolver<Vars> = async (
  root,
  { id },
  { user, dataSources },
) => {
  await dataSources.media.assertEditorPermissions(id);
  const [result] = await db()
    .table('media')
    .del()
    .where({ id })
    .returning(['id', 'url', 'kind']);
  if (
    result.kind === MediaKind.photo &&
    result.url &&
    !result.url.startsWith('http')
  ) {
    await minioClient.removeObject(MEDIA, result.url);
  }
  return {
    id: result.id,
    deleted: true,
  };
};

export default removeMedia;
