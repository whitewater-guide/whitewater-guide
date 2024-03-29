import { BannerKind } from '@whitewater-guide/schema';

import type { MutationResolvers } from '../../../apollo/index';
import { db } from '../../../db/index';
import { BANNERS, s3Client } from '../../../s3/index';

const removeBanner: MutationResolvers['removeBanner'] = async (_, { id }) => {
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
