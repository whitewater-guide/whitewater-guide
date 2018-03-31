import { GraphQLFieldResolver } from 'graphql';
import Joi from 'joi';
import { Context, isInputValidResolver, isSuperadminResolver } from '../../../apollo';
import db, { rawUpsert, stringifyJSON } from '../../../db';
import { TagInput, TagInputSchema } from '../../../ww-commons';

interface Vars {
  tag: TagInput;
}

const Schema = Joi.object().keys({
  tag: TagInputSchema,
});

const resolver: GraphQLFieldResolver<any, Context> = (root, { tag }: Vars, { language }) =>
  rawUpsert(db(), `SELECT upsert_tag('${stringifyJSON(tag)}', '${language}')`);

const queryResolver = isInputValidResolver(Schema).createResolver(resolver);

const upsertTag = isSuperadminResolver.createResolver(
  queryResolver,
);

export default upsertTag;
