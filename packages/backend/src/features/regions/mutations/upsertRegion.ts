import {
  MutationUpsertRegionArgs,
  RegionInputSchema,
} from '@whitewater-guide/schema';
import * as yup from 'yup';

import { isInputValidResolver, MutationResolvers } from '~/apollo';
import { db, rawUpsert } from '~/db';

const Schema: yup.SchemaOf<MutationUpsertRegionArgs> = yup.object({
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
