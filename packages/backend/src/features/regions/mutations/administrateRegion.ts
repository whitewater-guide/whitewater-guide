import {
  MutationAdministrateRegionArgs,
  RegionAdminSettings,
  RegionAdminSettingsSchema,
} from '@whitewater-guide/schema';
import get from 'lodash/get';
import mapValues from 'lodash/mapValues';
import * as yup from 'yup';

import {
  isInputValidResolver,
  MutationNotAllowedError,
  MutationResolvers,
} from '~/apollo';
import { db, Sql } from '~/db';
import { COVERS, s3Client } from '~/s3';

const Schema: yup.SchemaOf<MutationAdministrateRegionArgs> = yup.object({
  settings: RegionAdminSettingsSchema.clone().required(),
});

const updateImageFile = async (
  oldData: Sql.RegionsView,
  newData: RegionAdminSettings,
  oldPath: string,
  newPath: string,
) => {
  const oldValue = get(oldData, oldPath);
  const newValue = get(newData, newPath);
  if (oldValue && oldValue !== newValue) {
    await s3Client.removeFile(COVERS, oldValue);
  }
  if (newValue) {
    await s3Client.moveTempImage(newValue, COVERS);
  }
};

const administrateRegion: MutationResolvers['administrateRegion'] = async (
  _,
  { settings },
  context,
) => {
  const oldRegion: Sql.RegionsView = await db()
    .table('regions')
    .select(['id', 'cover_image'])
    .where({ id: settings.id })
    .first();
  if (!oldRegion) {
    throw new MutationNotAllowedError("Region doesn't exist");
  }
  await updateImageFile(
    oldRegion,
    settings,
    'cover_image.mobile',
    'coverImage.mobile',
  );
  await db()
    .table('regions')
    .update({
      hidden: settings.hidden,
      premium: settings.premium,
      sku: settings.sku || null,
      cover_image: mapValues(settings.coverImage, s3Client.getLocalFileName),
      maps_size: settings.mapsSize,
    })
    .where({ id: settings.id });
  return context.dataSources.regions.getById(settings.id);
};

export default isInputValidResolver(Schema, administrateRegion);
