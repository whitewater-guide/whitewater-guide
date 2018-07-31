import { isInputValidResolver, TopLevelResolver } from '@apollo';
import db from '@db';
import { SectionAdminSettings, SectionAdminSettingsStruct } from '@ww-commons';
import { struct } from '@ww-commons/utils/validation';

interface Vars {
  id: string;
  settings: SectionAdminSettings;
}

const Struct = struct.object({
  id: 'uuid',
  settings: SectionAdminSettingsStruct,
});

const resolver: TopLevelResolver<Vars> = async (_, { id, settings }, { dataSources }) => {
  await db().table('sections')
    .update({
      demo: settings.demo,
    })
    .where({ id });
  return dataSources.sections.getById(id);
};

const administrateSection = isInputValidResolver(Struct, resolver);

export default administrateSection;
