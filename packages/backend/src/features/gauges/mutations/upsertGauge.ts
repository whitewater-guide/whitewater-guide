import { GraphQLFieldResolver } from 'graphql';
import Joi from 'joi';
import { baseResolver, Context, isInputValidResolver, MutationNotAllowedError } from '../../../apollo';
import db, { rawUpsert, stringifyJSON } from '../../../db';
import { GaugeInput, GaugeInputSchema } from '../../../ww-commons';

interface Vars {
  gauge: GaugeInput;
}

const Schema = Joi.object().keys({
  gauge: GaugeInputSchema,
});

const resolver: GraphQLFieldResolver<any, any> = async (root, { gauge }: Vars, { language }: Context) => {
  if (gauge.id) {
    const { enabled } = await db().table('gauges').select(['enabled']).where({ id: gauge.id }).first();
    if (enabled) {
      throw new MutationNotAllowedError({ message: 'Disable gauge before editing it' });
    }
  }
  return rawUpsert(db(), `SELECT upsert_gauge('${stringifyJSON(gauge)}', '${language}')`);
};

const queryResolver = isInputValidResolver(Schema).createResolver(resolver);

const upsertGauge = baseResolver.createResolver(
  queryResolver,
);

export default upsertGauge;
