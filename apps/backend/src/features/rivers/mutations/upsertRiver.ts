import type { MutationUpsertRiverArgs } from '@whitewater-guide/schema';
import { RiverInputSchema } from '@whitewater-guide/schema';
import type { ObjectSchema } from 'yup';
import { object } from 'yup';

import type { MutationResolvers } from '../../../apollo/index';
import { isInputValidResolver } from '../../../apollo/index';
import { db, rawUpsert } from '../../../db/index';

const Schema: ObjectSchema<MutationUpsertRiverArgs> = object({
  river: RiverInputSchema.clone().required(),
});

const upsertRiver: MutationResolvers['upsertRiver'] = async (
  _,
  vars,
  { user, language, dataSources },
) => {
  const river = { ...vars.river, createdBy: user ? user.id : null };
  await dataSources.users.assertEditorPermissions({
    riverId: river.id,
    regionId: river.region.id,
  });
  return rawUpsert(db(), 'SELECT upsert_river(?, ?)', [river, language]);
};

export default isInputValidResolver(Schema, upsertRiver);
