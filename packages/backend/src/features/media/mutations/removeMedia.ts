import { MediaKind } from '@whitewater-guide/schema';

import type { MutationResolvers } from '../../../apollo/index';
import { db } from '../../../db/index';
import { MEDIA, s3Client } from '../../../s3/index';
import { insertLog } from '../utils/index';

const removeMedia: MutationResolvers['removeMedia'] = async (
  _,
  { id },
  { user, language, dataSources },
) => {
  await dataSources.users.assertEditorPermissions({ mediaId: id });
  const { section_id } = await db()
    .select('section_id')
    .from('sections_media')
    .where({ media_id: id })
    .first();
  const [result]: any[] = await db()
    .table('media')
    .del()
    .where({ id })
    .returning(['id', 'url', 'kind']);
  if (
    result.kind === MediaKind.Photo &&
    result.url &&
    !result.url.startsWith('http')
  ) {
    await s3Client.removeFile(MEDIA, result.url);
  }
  await insertLog(db(), {
    language,
    sectionId: section_id,
    action: 'media_delete',
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-assertion
    editorId: user!.id,
    diff: null,
  });
  return {
    id: result.id,
    deleted: true,
  };
};

export default removeMedia;
