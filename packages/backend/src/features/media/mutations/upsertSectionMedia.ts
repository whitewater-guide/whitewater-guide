import { GraphQLFieldResolver } from 'graphql';
import * as Joi from 'joi';
import { isAdminResolver, isInputValidResolver, upsertI18nResolver, ValidationError } from '../../../apollo';
import db, { rawUpsert } from '../../../db';
import { MediaInput, MediaInputSchema } from '../../../ww-commons';

interface UpsertVariables {
  sectionId: string;
  media: MediaInput;
  language?: string;
}

const Schema = Joi.object().keys({
  sectionId: Joi.string().uuid(),
  media: MediaInputSchema,
  language: Joi.string().optional(),
});

const resolver: GraphQLFieldResolver<any, any> =  async (root, { media, sectionId, language }: UpsertVariables) => {
  try {
    const result = await rawUpsert(
      db(),
      `SELECT upsert_section_media('${sectionId}', '${JSON.stringify(media)}', '${language}')`,
    );
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

const queryResolver: GraphQLFieldResolver<any, any> = (root, args: UpsertVariables, context, info) =>
  isInputValidResolver(Schema).createResolver(upsertI18nResolver(resolver))(root, args, context, info);

const upsertSectionMedia = isAdminResolver.createResolver(
  queryResolver,
);

export default upsertSectionMedia;
