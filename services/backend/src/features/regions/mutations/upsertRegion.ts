import { isInputValidResolver, TopLevelResolver } from '@apollo';
import db, { rawUpsert } from '@db';
import { RegionInput, RegionInputSchema } from '@whitewater-guide/commons';
import * as yup from 'yup';

interface Vars {
  region: RegionInput;
}

const Struct = yup.object({
  region: RegionInputSchema,
});

const resolver: TopLevelResolver<Vars> = async (
  _,
  { region },
  { language, dataSources },
) => {
  await dataSources.users.assertEditorPermissions({
    regionId: region.id,
  });
  const result: any = await rawUpsert(db(), 'SELECT upsert_region(?, ?)', [
    region,
    language,
  ]);
  // When created, add to all regions group
  if (!region.id && result.id) {
    await db().raw(
      `
      INSERT INTO regions_groups (region_id, group_id)
      SELECT ?, id
      FROM groups
      WHERE all_regions = TRUE
      LIMIT 1
      ON CONFLICT DO NOTHING
    `,
      result.id,
    );
  }
  return result;
};

const upsertRegion = isInputValidResolver(Struct, resolver);

export default upsertRegion;
