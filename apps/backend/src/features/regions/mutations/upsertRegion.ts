import type { MutationUpsertRegionArgs } from '@whitewater-guide/schema';
import { RegionInputSchema } from '@whitewater-guide/schema';
import type { ObjectSchema } from 'yup';
import { object } from 'yup';

import type { MutationResolvers } from '../../../apollo/index';
import { isInputValidResolver } from '../../../apollo/index';
import { db, rawUpsert } from '../../../db/index';

const Schema: ObjectSchema<MutationUpsertRegionArgs> = object({
  region: RegionInputSchema.clone().required(),
});

const upsertRegion: MutationResolvers['upsertRegion'] = async (
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

export default isInputValidResolver(Schema, upsertRegion);
