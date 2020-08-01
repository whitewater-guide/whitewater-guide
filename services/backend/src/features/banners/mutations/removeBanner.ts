import { BANNERS, minioClient } from '~/minio';
import { NodeQuery, TopLevelResolver } from '~/apollo';

import { BannerKind } from '@whitewater-guide/commons';
import db from '~/db';

const removeBanner: TopLevelResolver = async (root, { id }: NodeQuery) => {
  const result: any = await db()
    .table('banners')
    .del()
    .where({ id })
    .returning(['id', 'source']);
  const [{ source }] = result;
  if (source && source.kind === BannerKind.Image) {
    await minioClient.removeObject(BANNERS, source.url);
  }
  return { id, deleted: true };
};

export default removeBanner;
