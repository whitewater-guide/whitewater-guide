import { GraphQLFieldResolver } from 'graphql';
import * as Joi from 'joi';
import { isAdminResolver, isInputValidResolver, upsertI18nResolver } from '../../../apollo';
import db, { rawUpsert } from '../../../db';
import { GaugeInput, GaugeInputSchema } from '../../../ww-commons';

interface UpsertVariables {
  gauge: GaugeInput;
  language?: string;
}

const Schema = Joi.object().keys({
  gauge: GaugeInputSchema,
  language: Joi.string().optional(),
});

const resolver: GraphQLFieldResolver<any, any> = (root, { gauge, language }: UpsertVariables) =>
  rawUpsert(db(), `SELECT upsert_gauge('${JSON.stringify(gauge)}', '${language}')`);

const queryResolver: GraphQLFieldResolver<any, any> = (root, args: UpsertVariables, context, info) =>
  isInputValidResolver(Schema).createResolver(upsertI18nResolver(resolver))(root, args, context, info);

const upsertGauge = isAdminResolver.createResolver(
  queryResolver,
);

export default upsertGauge;
