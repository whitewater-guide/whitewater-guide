export type S3Prefix = 'temp' | 'media' | 'avatars' | 'covers' | 'banners';

const isTest = process.env.JEST_WORKER_ID;

export const CONTENT_BUCKET = isTest
  ? `content-${process.env.JEST_WORKER_ID}`
  : 'content';

export const TEMP = 'temp';
export const MEDIA = 'media';
export const AVATARS = 'avatars';
export const COVERS = 'covers';
export const BANNERS = 'banners';
