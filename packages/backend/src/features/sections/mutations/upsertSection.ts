import { GraphQLFieldResolver } from 'graphql';
import Joi from 'joi';
import { Context, isAdminResolver, isInputValidResolver, upsertI18nResolver } from '../../../apollo';
import db from '../../../db';
import { rawUpsert } from '../../../db/rawUpsert';
import { SectionInput, SectionInputSchema } from '../../../ww-commons';

interface UpsertVariables {
  section: SectionInput;
  language?: string;
}

const Schema = Joi.object().keys({
  section: SectionInputSchema,
  language: Joi.string().optional(),
});

const resolver: GraphQLFieldResolver<any, any> = async (root, vars: UpsertVariables, { user }: Context) => {
  const { language } = vars;
  const section = { ...vars.section, createdBy: user!.id };
  const result = await rawUpsert(db(), `SELECT upsert_section('${JSON.stringify(section)}', '${language}')`);
  // console.log(result);
  return result;
};

const queryResolver: GraphQLFieldResolver<any, any> = (root, args: UpsertVariables, context, info) => {
  return isInputValidResolver(Schema).createResolver(upsertI18nResolver(resolver))(root, args, context, info);
};

const upsertSection = isAdminResolver.createResolver(
  queryResolver,
);

export default upsertSection;
