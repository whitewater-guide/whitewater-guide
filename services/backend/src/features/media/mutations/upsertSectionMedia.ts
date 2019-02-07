import { isInputValidResolver, TopLevelResolver } from '@apollo';
import db, { rawUpsert } from '@db';
import insertLog from '@features/media/mutations/insertLogs';
import log from '@log';
import { MEDIA, minioClient, moveTempImage, TEMP } from '@minio';
import {
  baseStruct,
  MediaInput,
  MediaInputStruct,
} from '@whitewater-guide/commons';
import { UserInputError } from 'apollo-server';
import { MediaRaw } from '../types';

interface Vars {
  sectionId: string;
  media: MediaInput;
}

const Struct = baseStruct.object({
  sectionId: 'uuid',
  media: MediaInputStruct,
});

const resolver: TopLevelResolver<Vars> = async (root, vars, context) => {
  const { sectionId } = vars;
  const { language, user, dataSources } = context;
  await dataSources.media.assertEditorPermissions(undefined, sectionId);
  let size = 0;
  try {
    const stat = await minioClient.statObject(TEMP, vars.media.url);
    size = stat.size;
  } catch (e) {
    log.error(vars.media, 'Failed to get temp file size');
  }
  const media = { ...vars.media, createdBy: user ? user.id : null, size };
  try {
    const result: MediaRaw = (await rawUpsert(
      db(),
      'SELECT upsert_section_media(?, ?, ?)',
      [sectionId, media, language],
    )) as MediaRaw;
    await moveTempImage(result.id, MEDIA);
    const isCreated = result.created_at === result.updated_at;
    await insertLog(db(), {
      language,
      sectionId,
      action: isCreated ? 'media_create' : 'media_update',
      editorId: user!.id,
    });
    return result;
  } catch (err) {
    // foreign_key_violation - non-existing section id
    if (
      err.code === '23503' &&
      err.constraint === 'sections_media_section_id_foreign'
    ) {
      throw new UserInputError('Invalid section id');
    }
    // unique_violation - trying assign media to different section
    // breaks media * --- 1 section relation (many to one)
    if (
      err.code === '23505' &&
      err.constraint === 'sections_media_media_id_unique'
    ) {
      throw new UserInputError('Invalid section id');
    }
    throw err;
  }
};

const upsertSectionMedia = isInputValidResolver(Struct, resolver);

export default upsertSectionMedia;
