import { GraphQLFieldResolver } from 'graphql';
import Joi from 'joi';
import { baseResolver, Context, isInputValidResolver } from '../../../apollo';
import db, { rawUpsert, stringifyJSON } from '../../../db';
import { SectionInput, SectionInputSchema } from '../../../ww-commons';

interface Vars {
  section: SectionInput;
}

const Schema = Joi.object().keys({
  section: SectionInputSchema,
});

const resolver: GraphQLFieldResolver<any, Context> = async (root, vars: Vars, { user, language }) => {
  const section = { ...vars.section, createdBy: user!.id };
  const result = await rawUpsert(db(), `SELECT upsert_section('${stringifyJSON(section)}', '${language}')`);
  // console.log(result);
  return result;
};

const queryResolver = isInputValidResolver(Schema).createResolver(resolver);

const upsertSection = baseResolver.createResolver(
  queryResolver,
);

export default upsertSection;
