import { GraphQLFieldResolver } from 'graphql';
import Joi from 'joi';
import { baseResolver, Context, isInputValidResolver } from '../../../apollo';
import db, { rawUpsert, stringifyJSON } from '../../../db';
import { RiverInput, RiverInputSchema } from '../../../ww-commons';

interface Vars {
  river: RiverInput;
}

const Schema = Joi.object().keys({
  river: RiverInputSchema,
});

const resolver: GraphQLFieldResolver<any, Context> = async (root, vars: Vars, { user, language }) => {
  const river = { ...vars.river, createdBy: user!.id };
  return rawUpsert(db(), `SELECT upsert_river('${stringifyJSON(river)}', '${language}')`);
};

const queryResolver = isInputValidResolver(Schema).createResolver(resolver);

const upsertRiver = baseResolver.createResolver(
  queryResolver,
);

export default upsertRiver;
