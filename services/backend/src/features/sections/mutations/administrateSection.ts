import { isInputValidResolver, TopLevelResolver } from '@apollo';
import db from '@db';
import {
  SectionAdminSettings,
  SectionAdminSettingsSchema,
  yupTypes,
} from '@whitewater-guide/commons';
import * as yup from 'yup';

interface Vars {
  id: string;
  settings: SectionAdminSettings;
}

const Struct = yup.object({
  id: yupTypes.uuid(),
  settings: SectionAdminSettingsSchema,
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
