import { NodeQuery, TopLevelResolver } from '@apollo';
import db from '@db';
import { BANNERS, minioClient } from '@minio';
import { BannerKind } from '@ww-commons';

const removeBanner: TopLevelResolver = async (root, { id }: NodeQuery) => {
  const result = await db()
    .table('banners')
    .del()
    .where({ id })
    .returning(['id', 'source']);
  const [{ source }] = result;
  if (source && source.kind === BannerKind.Image) {
    await minioClient.removeObject(BANNERS, source.src);
  }
  return { id, deleted: true };
};

export default removeBanner;
