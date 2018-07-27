import { isInputValidResolver } from '@apollo';
import db from '@db';
import { SectionAdminSettings, SectionAdminSettingsSchema } from '@ww-commons';
import { GraphQLFieldResolver } from 'graphql';
import Joi from 'joi';
import { buildSectionQuery } from '../queryBuilder';

interface Vars {
  id: string;
  settings: SectionAdminSettings;
}

const Schema = Joi.object().keys({
  id: Joi.string().guid(),
  settings: SectionAdminSettingsSchema,
});

const resolver: GraphQLFieldResolver<any, any, Vars> = async (_, { id, settings }, context, info) => {
  await db().table('sections')
    .update({
      demo: settings.demo,
    })
    .where({ id });
  return buildSectionQuery({ info, context, id }).first();
};

const administrateSection = isInputValidResolver(Schema).createResolver(resolver);

export default administrateSection;
