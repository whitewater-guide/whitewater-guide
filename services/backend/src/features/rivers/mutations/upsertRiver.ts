import { isInputValidResolver, TopLevelResolver } from '~/apollo';
import db, { rawUpsert } from '~/db';
import { RiverInput, RiverInputSchema } from '@whitewater-guide/commons';
import * as yup from 'yup';

interface Vars {
  river: RiverInput;
}

const Struct = yup.object({
  river: RiverInputSchema,
});

const resolver: TopLevelResolver<Vars> = async (
  root,
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

const upsertRiver = isInputValidResolver(Struct, resolver);

export default upsertRiver;
