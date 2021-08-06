import {
  MutationUpsertRiverArgs,
  RiverInputSchema,
} from '@whitewater-guide/schema';
import * as yup from 'yup';

import { isInputValidResolver, MutationResolvers } from '~/apollo';
import { db, rawUpsert } from '~/db';

const Schema: yup.SchemaOf<MutationUpsertRiverArgs> = yup.object({
  river: RiverInputSchema.clone(),
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
