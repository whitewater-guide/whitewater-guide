import { GraphQLFieldResolver } from 'graphql';
import Joi from 'joi';
import { isInputValidResolver } from '../../../apollo';
import db from '../../../db';
import { RegionAdminSettings, RegionAdminSettingsSchema } from '../../../ww-commons';
import { buildRegionQuery } from '../queryBuilder';

interface Vars {
  regionId: string;
  settings: RegionAdminSettings;
}

const Schema = Joi.object().keys({
  regionId: Joi.string().guid(),
  settings: RegionAdminSettingsSchema,
});

const resolver: GraphQLFieldResolver<any, any, Vars> = async (_, { regionId, settings }, context, info) => {
  await db().table('regions')
    .update({
      hidden: settings.hidden,
      premium: settings.premium,
      sku: settings.sku || null,
    })
    .where({ id: regionId });
  return buildRegionQuery({ info, context, id: regionId }).first();
};

const administrateRegion = isInputValidResolver(Schema).createResolver(resolver);

export default administrateRegion;
