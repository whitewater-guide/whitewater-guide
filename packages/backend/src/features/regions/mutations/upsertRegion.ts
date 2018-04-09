import { GraphQLFieldResolver } from 'graphql';
import Joi from 'joi';
import { Context, isInputValidResolver } from '../../../apollo';
import db, { rawUpsert } from '../../../db';
import { RegionInput, RegionInputSchema } from '../../../ww-commons';
import checkEditorPermissions from '../checkEditorPermissions';

interface Vars {
  region: RegionInput;
}

const Schema = Joi.object().keys({
  region: RegionInputSchema,
});

const resolver: GraphQLFieldResolver<any, Context> = async (_, { region }: Vars, { language, user }) => {
  await checkEditorPermissions(user, region.id);
  return rawUpsert(db(), 'SELECT upsert_region(?, ?)', [region, language]);
};

const upsertRegion = isInputValidResolver(Schema).createResolver(resolver);

export default upsertRegion;
