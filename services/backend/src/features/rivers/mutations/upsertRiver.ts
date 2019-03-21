import { isInputValidResolver, TopLevelResolver } from '@apollo';
import db, { rawUpsert } from '@db';
import { RiverInput, RiverInputStruct } from '@whitewater-guide/commons';
import { struct } from 'superstruct';

interface Vars {
  river: RiverInput;
}

const Struct = struct.object({
  river: RiverInputStruct,
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
