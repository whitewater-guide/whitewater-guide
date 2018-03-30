import { GraphQLFieldResolver } from 'graphql';
import Joi from 'joi';
import { isAdminResolver, isInputValidResolver, MutationNotAllowedError, upsertI18nResolver } from '../../../apollo';
import db, { rawUpsert, stringifyJSON } from '../../../db';
import { GaugeInput, GaugeInputSchema } from '../../../ww-commons';

interface UpsertVariables {
  gauge: GaugeInput;
  language?: string;
}

const Schema = Joi.object().keys({
  gauge: GaugeInputSchema,
  language: Joi.string().optional(),
});

const resolver: GraphQLFieldResolver<any, any> = async (root, { gauge, language }: UpsertVariables) => {
  if (gauge.id) {
    const { enabled } = await db().table('gauges').select(['enabled']).where({ id: gauge.id }).first();
    if (enabled) {
      throw new MutationNotAllowedError({ message: 'Disable gauge before editing it' });
    }
  }
  return rawUpsert(db(), `SELECT upsert_gauge('${stringifyJSON(gauge)}', '${language}')`);
};

const queryResolver: GraphQLFieldResolver<any, any> = (root, args: UpsertVariables, context, info) =>
  isInputValidResolver(Schema).createResolver(upsertI18nResolver(resolver))(root, args, context, info);

const upsertGauge = isAdminResolver.createResolver(
  queryResolver,
);

export default upsertGauge;
