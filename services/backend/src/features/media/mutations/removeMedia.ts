import { TopLevelResolver } from '~/apollo';
import db from '~/db';
import { MEDIA, minioClient } from '~/minio';
import { MediaKind } from '@whitewater-guide/commons';
import { insertLog } from '../utils';

interface Vars {
  id: string;
}

const removeMedia: TopLevelResolver<Vars> = async (
  root,
  { id },
  { user, language, dataSources },
) => {
  await dataSources.users.assertEditorPermissions({ mediaId: id });
  const { section_id } = await db()
    .select('section_id')
    .from('sections_media')
    .where({ media_id: id })
    .first();
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
  await insertLog(db(), {
    language,
    sectionId: section_id,
    action: 'media_delete',
    editorId: user!.id,
    diff: null,
  });
  return {
    id: result.id,
    deleted: true,
  };
};

export default removeMedia;
