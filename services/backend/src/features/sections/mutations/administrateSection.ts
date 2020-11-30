import * as yup from 'yup';

import {
  SectionAdminSettings,
  SectionAdminSettingsSchema,
} from '@whitewater-guide/commons';
import { TopLevelResolver, isInputValidResolver } from '~/apollo';

import db from '~/db';
import { yupTypes } from '@whitewater-guide/validation';

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