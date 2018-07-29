import { isInputValidResolver, TopLevelResolver } from '@apollo';
import db, { rawUpsert } from '@db';
import { RegionInput, RegionInputSchema } from '@ww-commons';
import Joi from 'joi';

interface Vars {
  region: RegionInput;
}

const Schema = Joi.object().keys({
  region: RegionInputSchema,
});

const resolver: TopLevelResolver<Vars> = async (_, { region }: Vars, { language, user, models }) => {
  await models.regions.assertEditorPermissions(region.id);
  const result: any = await rawUpsert(db(), 'SELECT upsert_region(?, ?)', [region, language]);
  // When created, add to all regions group
  if (!region.id && result.id) {
    await db().raw(`
      INSERT INTO regions_groups (region_id, group_id)
      SELECT ?, id
      FROM groups
      WHERE all_regions = TRUE
      LIMIT 1
      ON CONFLICT DO NOTHING
    `, result.id);
  }
  return result;
};

const upsertRegion = isInputValidResolver(Schema).createResolver(resolver);

export default upsertRegion;
