import { GraphQLFieldResolver } from 'graphql';
import Joi from 'joi';
import get from 'lodash/get';
import { isInputValidResolver, MutationNotAllowedError } from '../../../apollo';
import db from '../../../db';
import { BANNERS, COVERS, minioClient, moveTempImage } from '../../../minio';
import { RegionAdminSettings, RegionAdminSettingsSchema } from '../../../ww-commons';
import { buildRegionQuery } from '../queryBuilder';
import { RegionRaw } from '../types';

interface Vars {
  regionId: string;
  settings: RegionAdminSettings;
}

const Schema = Joi.object().keys({
  regionId: Joi.string().guid(),
  settings: RegionAdminSettingsSchema,
});

const updateImageFile = async (
  bucket: string,
  oldData: RegionRaw,
  newData: RegionAdminSettings,
  oldPath: string,
  newPath: string,
) => {
  const oldValue = get(oldData, oldPath);
  const newValue = get(newData, newPath);
  if (oldValue && oldValue !== newValue) {
    await minioClient.removeObject(bucket, oldValue);
  }
  if (newValue) {
    await moveTempImage(newValue, bucket);
  }
};

const resolver: GraphQLFieldResolver<any, any, Vars> = async (_, { regionId, settings }, context, info) => {
  const oldRegion: RegionRaw = await db().table('regions')
    .select(['id', 'cover_image', 'banners'])
    .where({ id: regionId })
    .first();
  if (!oldRegion) {
    throw new MutationNotAllowedError({ message: "Region doesn't exist" });
  }
  await Promise.all([
    updateImageFile(COVERS, oldRegion, settings, 'cover_image.mobile', 'coverImage.mobile'),
    updateImageFile(BANNERS, oldRegion, settings, 'banners.sectionDescriptionMobile', 'banners.sectionDescriptionMobile'),
    updateImageFile(BANNERS, oldRegion, settings, 'banners.sectionRowMobile', 'banners.sectionRowMobile'),
    updateImageFile(BANNERS, oldRegion, settings, 'banners.sectionMediaMobile', 'banners.sectionMediaMobile'),
    updateImageFile(BANNERS, oldRegion, settings, 'banners.regionDescriptionMobile', 'banners.regionDescriptionMobile'),
    updateImageFile(BANNERS, oldRegion, settings, 'banners.regionLoadingMobile', 'banners.regionLoadingMobile'),
  ]);
  await db().table('regions')
    .update({
      hidden: settings.hidden,
      premium: settings.premium,
      sku: settings.sku || null,
      cover_image: settings.coverImage,
      banners: settings.banners,
    })
    .where({ id: regionId });
  return buildRegionQuery({ info, context, id: regionId }).first();
};

const administrateRegion = isInputValidResolver(Schema).createResolver(resolver);

export default administrateRegion;
