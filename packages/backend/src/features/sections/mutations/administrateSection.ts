import { isInputValidResolver, TopLevelResolver } from '@apollo';
import db from '@db';
import { SectionAdminSettings, SectionAdminSettingsSchema } from '@ww-commons';
import Joi from 'joi';

interface Vars {
  id: string;
  settings: SectionAdminSettings;
}

const Schema = Joi.object().keys({
  id: Joi.string().guid(),
  settings: SectionAdminSettingsSchema,
});

const resolver: TopLevelResolver<Vars> = async (_, { id, settings }, { dataSources }) => {
  await db().table('sections')
    .update({
      demo: settings.demo,
    })
    .where({ id });
  return dataSources.sections.getById(id);
};

const administrateSection = isInputValidResolver(Schema).createResolver(resolver);

export default administrateSection;
