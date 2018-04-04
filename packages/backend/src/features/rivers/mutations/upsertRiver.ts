import { GraphQLFieldResolver } from 'graphql';
import Joi from 'joi';
import { Context, isInputValidResolver } from '../../../apollo';
import db, { rawUpsert, stringifyJSON } from '../../../db';
import { RiverInput, RiverInputSchema } from '../../../ww-commons';
import checkEditorPermissions from '../checkEditorPermissions';

interface Vars {
  river: RiverInput;
}

const Schema = Joi.object().keys({
  river: RiverInputSchema,
});

const resolver: GraphQLFieldResolver<any, Context> = async (root, vars: Vars, { user, language }) => {
  const river = { ...vars.river, createdBy: user ? user.id : null };
  await checkEditorPermissions(user, river.id, river.region.id);
  return rawUpsert(db(), `SELECT upsert_river('${stringifyJSON(river)}', '${language}')`);
};

const upsertRiver = isInputValidResolver(Schema).createResolver(resolver);

export default upsertRiver;
