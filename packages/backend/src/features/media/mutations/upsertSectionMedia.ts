import { GraphQLFieldResolver } from 'graphql';
import * as Joi from 'joi';
import { isAdminResolver, isInputValidResolver, upsertI18nResolver } from '../../../apollo';
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

const resolver: GraphQLFieldResolver<any, any> = (root, { media, sectionId, language }: UpsertVariables) =>
  rawUpsert(db(), `SELECT upsert_media('${sectionId}', ${JSON.stringify(media)}', '${language}')`);

const queryResolver: GraphQLFieldResolver<any, any> = (root, args: UpsertVariables, context, info) =>
  isInputValidResolver(Schema).createResolver(upsertI18nResolver(resolver))(root, args, context, info);

const upsertSectionMedia = isAdminResolver.createResolver(
  queryResolver,
);

export default upsertSectionMedia;
