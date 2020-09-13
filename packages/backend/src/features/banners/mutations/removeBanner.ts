import { BannerKind } from '@whitewater-guide/commons';

import { NodeQuery, TopLevelResolver } from '~/apollo';
import db from '~/db';
import { BANNERS, s3Client } from '~/s3';

const removeBanner: TopLevelResolver = async (root, { id }: NodeQuery) => {
  const result: any = await db()
    .table('banners')
    .del()
    .where({ id })
    .returning(['id', 'source']);
  const [{ source }] = result;
  if (source && source.kind === BannerKind.Image) {
    await s3Client.removeFile(BANNERS, source.url);
  }
  return { id, deleted: true };
};

export default removeBanner;
