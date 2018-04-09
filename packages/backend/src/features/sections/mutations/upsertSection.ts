import { GraphQLFieldResolver } from 'graphql';
import Joi from 'joi';
import { Context, isInputValidResolver } from '../../../apollo';
import db, { rawUpsert } from '../../../db';
import { SectionInput, SectionInputSchema } from '../../../ww-commons';
import checkEditorPermissions from '../checkEditorPermissions';

interface Vars {
  section: SectionInput;
}

const Schema = Joi.object().keys({
  section: SectionInputSchema,
});

const resolver: GraphQLFieldResolver<any, Context> = async (root, vars: Vars, { user, language }) => {
  const section = { ...vars.section, createdBy: user ? user.id : null };
  await checkEditorPermissions(user, section.id, section.river.id);
  return rawUpsert(db(), 'SELECT upsert_section(?, ?)', [section, language]);
};

const upsertSection = isInputValidResolver(Schema).createResolver(resolver);

export default upsertSection;
