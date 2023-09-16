import type { MutationAdministrateSectionArgs } from '@whitewater-guide/schema';
import { SectionAdminSettingsSchema } from '@whitewater-guide/schema';
import type { ObjectSchema } from 'yup';
import { object, string } from 'yup';

import type { MutationResolvers } from '../../../apollo/index';
import { isInputValidResolver } from '../../../apollo/index';
import { db } from '../../../db/index';

const Schema: ObjectSchema<MutationAdministrateSectionArgs> = object({
  id: string().uuid().required(),
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
