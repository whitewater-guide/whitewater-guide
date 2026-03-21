import type {
  BannerInput,
  MutationUpsertBannerArgs,
} from '@whitewater-guide/schema';
import { BannerInputSchema, BannerKind } from '@whitewater-guide/schema';
import type { ObjectSchema } from 'yup';
import { object } from 'yup';

import type { MutationResolvers } from '../../../apollo/index';
import { isInputValidResolver, UserInputError } from '../../../apollo/index';
import type { Sql } from '../../../db/index';
import { db, rawUpsert } from '../../../db/index';
import { BANNERS, s3Client } from '../../../s3/index';

const Schema: ObjectSchema<MutationUpsertBannerArgs> = object({
  banner: BannerInputSchema.clone().required(),
});

const upsertBannerResolver: MutationResolvers['upsertBanner'] = async (
  _,
  vars,
) => {
  const { id } = vars.banner;
  const isImage = vars.banner.source.kind === BannerKind.Image;
  const url = isImage
    ? s3Client.getLocalFileName(vars.banner.source.url)
    : vars.banner.source.url;
  if (!url) {
    throw new UserInputError('invalid input', {
      validationErrors: { source: { url: 'mixed.defined' } },
    });
  }
  const banner: BannerInput = {
    ...vars.banner,
    source: {
      ...vars.banner.source,
      url,
    },
  };
  let shouldMoveTempImage = isImage;

  if (id) {
    const oldBanner: Sql.Banners = await db()
      .select()
      .from('banners')
      .where({ id })
      .first();
    const wasImage = oldBanner.source.kind === BannerKind.Image;
    const sameImage = oldBanner.source.url === banner.source.url;
    shouldMoveTempImage = shouldMoveTempImage && !sameImage;
    if (wasImage && oldBanner.source && (!isImage || !sameImage)) {
      const objectName = oldBanner.source.url;
      if (objectName) {
        await s3Client.removeFile(BANNERS, objectName);
      }
    }
  }
  if (shouldMoveTempImage) {
    await s3Client.moveTempImage(banner.source.url, BANNERS);
  }
  return rawUpsert(db(), 'SELECT upsert_banner(?)', [banner]);
};

const upsertBanner = isInputValidResolver(Schema, upsertBannerResolver);

export default upsertBanner;
