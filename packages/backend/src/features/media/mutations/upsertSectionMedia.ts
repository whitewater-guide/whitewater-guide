import { GraphQLFieldResolver } from 'graphql';
import Joi from 'joi';
import { isAdminResolver, isInputValidResolver, ValidationError } from '../../../apollo';
import db, { rawUpsert, stringifyJSON } from '../../../db';
import { MEDIA, moveTempImage } from '../../../minio';
import { MediaInput, MediaInputSchema } from '../../../ww-commons';
import { MediaRaw } from '../types';

interface Vars {
  sectionId: string;
  media: MediaInput;
}

const Schema = Joi.object().keys({
  sectionId: Joi.string().uuid(),
  media: MediaInputSchema,
});

const resolver: GraphQLFieldResolver<any, any> =  async (root, { media, sectionId }: Vars, { language }) => {
  try {
    const result: MediaRaw = await rawUpsert(
      db(),
      `SELECT upsert_section_media('${sectionId}', '${stringifyJSON(media)}', '${language}')`,
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

const upsertSectionMedia = isAdminResolver.createResolver(
  queryResolver,
);

export default upsertSectionMedia;
