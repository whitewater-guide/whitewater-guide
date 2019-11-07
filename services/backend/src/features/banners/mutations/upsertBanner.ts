import { isInputValidResolver, TopLevelResolver } from '@apollo';
import db, { rawUpsert } from '@db';
import { BannerRaw } from '@features/banners';
import { BANNERS, getLocalFileName, minioClient, moveTempImage } from '@minio';
import {
  BannerInput,
  BannerInputSchema,
  BannerKind,
} from '@whitewater-guide/commons';
import * as yup from 'yup';

interface Vars {
  banner: BannerInput;
}

const Schema = yup.object({
  banner: BannerInputSchema,
});

const upsertBannerResolver: TopLevelResolver<Vars> = async (_, vars) => {
  const id = vars.banner.id;
  const isImage = vars.banner.source.kind === BannerKind.Image;
  const banner: BannerInput = {
    ...vars.banner,
    source: {
      ...vars.banner.source,
      url: isImage
        ? getLocalFileName(vars.banner.source.url)!
        : vars.banner.source.url,
    },
  };
  let shouldMoveTempImage = isImage;

  if (id) {
    const oldBanner: BannerRaw = await db()
      .select()
      .from('banners')
      .where({ id })
      .first();
    const wasImage = oldBanner.source.kind === BannerKind.Image;
    const sameImage = oldBanner.source.url === banner.source.url;
    shouldMoveTempImage = shouldMoveTempImage && !sameImage;
    if (wasImage && oldBanner.source && (!isImage || !sameImage)) {
      const objectName = oldBanner.source.url || oldBanner.source.src;
      if (objectName) {
        await minioClient.removeObject(BANNERS, objectName);
      }
    }
  }
  if (shouldMoveTempImage) {
    await moveTempImage(banner.source.url!, BANNERS);
  }
  return rawUpsert(db(), 'SELECT upsert_banner(?)', [banner]);
};

const upsertBanner = isInputValidResolver(Schema, upsertBannerResolver);

export default upsertBanner;
