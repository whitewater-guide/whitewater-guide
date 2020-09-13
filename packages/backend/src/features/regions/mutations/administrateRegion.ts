import {
  RegionAdminSettings,
  RegionAdminSettingsSchema,
} from '@whitewater-guide/commons';
import get from 'lodash/get';
import mapValues from 'lodash/mapValues';
import * as yup from 'yup';

import {
  isInputValidResolver,
  MutationNotAllowedError,
  TopLevelResolver,
} from '~/apollo';
import db from '~/db';
import { COVERS, s3Client } from '~/s3';

import { RegionRaw } from '../types';

interface Vars {
  settings: RegionAdminSettings;
}

const Struct = yup.object({
  settings: RegionAdminSettingsSchema,
});

const updateImageFile = async (
  oldData: RegionRaw,
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

const resolver: TopLevelResolver<Vars> = async (_, { settings }, context) => {
  const oldRegion: RegionRaw = await db()
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

const administrateRegion = isInputValidResolver(Struct, resolver);

export default administrateRegion;
