import {
  MutationAdministrateSectionArgs,
  SectionAdminSettingsSchema,
} from '@whitewater-guide/schema';
import * as yup from 'yup';

import { isInputValidResolver, MutationResolvers } from '~/apollo';
import { db } from '~/db';

const Schema: yup.SchemaOf<MutationAdministrateSectionArgs> = yup.object({
  id: yup.string().uuid().required(),
  settings: SectionAdminSettingsSchema.clone(),
});

const administrateSection: MutationResolvers['administrateSection'] = async (
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

export default isInputValidResolver(Schema, administrateSection);
