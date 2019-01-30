import { isInputValidResolver, TopLevelResolver } from '@apollo';
import db from '@db';
import {
  baseStruct,
  SectionAdminSettings,
  SectionAdminSettingsStruct,
} from '@whitewater-guide/commons';

interface Vars {
  id: string;
  settings: SectionAdminSettings;
}

const Struct = baseStruct.object({
  id: 'uuid',
  settings: SectionAdminSettingsStruct,
});

const resolver: TopLevelResolver<Vars> = async (
  _,
  { id, settings },
  { dataSources },
) => {
  await db()
    .table('sections')
    .update({
      demo: settings.demo,
    })
    .where({ id });
  return dataSources.sections.getById(id);
};

const administrateSection = isInputValidResolver(Struct, resolver);

export default administrateSection;
