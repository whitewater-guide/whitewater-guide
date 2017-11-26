import { GraphQLFieldResolver } from 'graphql';
import * as Joi from 'joi';
import { isInputValidResolver, isSuperadminResolver, upsertI18nResolver } from '../../../apollo';
import db, { rawUpsert } from '../../../db';
import { TagInput, TagInputSchema } from '../../../ww-commons';

interface UpsertVariables {
  tag: TagInput;
  language?: string;
}

const Schema = Joi.object().keys({
  tag: TagInputSchema,
  language: Joi.string().optional(),
});

const resolver: GraphQLFieldResolver<any, any> = (root, { tag, language }: UpsertVariables) =>
  rawUpsert(db(), `SELECT upsert_tag('${JSON.stringify(tag)}', '${language}')`);

const queryResolver: GraphQLFieldResolver<any, any> = (root, args: UpsertVariables, context, info) =>
  isInputValidResolver(Schema).createResolver(upsertI18nResolver(resolver))(root, args, context, info);

const upsertTag = isSuperadminResolver.createResolver(
  queryResolver,
);

export default upsertTag;
