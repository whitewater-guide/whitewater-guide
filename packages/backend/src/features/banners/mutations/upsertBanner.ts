import { isInputValidResolver, TopLevelResolver } from '@apollo';
import db, { rawUpsert } from '@db';
import { BannerRaw } from '@features/banners';
import { BANNERS, minioClient, moveTempImage } from '@minio';
import { BannerInput, BannerInputStruct, BannerKind } from '@ww-commons';
import { struct } from 'superstruct';

interface Vars {
  banner: BannerInput;
}

const Struct = struct.object({
  banner: BannerInputStruct,
});

const upsertBannerResolver: TopLevelResolver<Vars> =  async (_, { banner }) => {
  const id = banner.id;
  const isImage = banner.source.kind === BannerKind.Image;
  let shouldMoveTempImage = isImage;
  if (id) {
    const oldBanner: BannerRaw = await db()
      .select()
      .from('banners')
      .where({ id })
      .first();
    const wasImage = oldBanner.source.kind === BannerKind.Image;
    const sameImage = oldBanner.source.src === banner.source.src;
    shouldMoveTempImage = shouldMoveTempImage && !sameImage;
    if (wasImage && oldBanner.source && (!isImage || !sameImage)) {
      await minioClient.removeObject(BANNERS, oldBanner.source.src!);
    }
  }
  if (shouldMoveTempImage) {
    await moveTempImage(banner.source.src!, BANNERS);
  }
  return rawUpsert(db(), 'SELECT upsert_banner(?)', [banner]);
};

const upsertBanner = isInputValidResolver(Struct, upsertBannerResolver);

export default upsertBanner;
