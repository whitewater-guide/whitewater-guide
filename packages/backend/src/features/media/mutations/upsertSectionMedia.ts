import { baseResolver, isInputValidResolver, TopLevelResolver, ValidationError } from '@apollo';
import db, { rawUpsert } from '@db';
import { MEDIA, moveTempImage } from '@minio';
import { MediaInput, MediaInputSchema } from '@ww-commons';
import Joi from 'joi';
import { MediaRaw } from '../types';

interface Vars {
  sectionId: string;
  media: MediaInput;
}

const Schema = Joi.object().keys({
  sectionId: Joi.string().uuid(),
  media: MediaInputSchema,
});

const resolver: TopLevelResolver<Vars> = async (root, vars: Vars, context) => {
  const { sectionId } = vars;
  const { language, user, dataSources } = context;
  await dataSources.media.assertEditorPermissions(undefined, sectionId);
  const media = { ...vars.media, createdBy: user ? user.id : null };
  try {
    const result: MediaRaw = await rawUpsert(
      db(),
      'SELECT upsert_section_media(?, ?, ?)',
      [sectionId, media, language],
    ) as MediaRaw;
    await moveTempImage(result.id, MEDIA);
    return result;
  } catch (err) {
    // foreign_key_violation - non-existing section id
    if (err.code === '23503' && err.constraint === 'sections_media_section_id_foreign') {
      throw new ValidationError({ message: 'Invalid section id' });
    }
    // unique_violation - trying assign media to different section
    // breaks media * --- 1 section relation (many to one)
    if (err.code === '23505' && err.constraint === 'sections_media_media_id_unique') {
      throw new ValidationError({ message: 'Invalid section id' });
    }
    throw err;
  }
};

const queryResolver = isInputValidResolver(Schema).createResolver(resolver);

const upsertSectionMedia = baseResolver.createResolver(
  queryResolver,
);

export default upsertSectionMedia;
