import config from '~/config';
/* eslint-disable node/no-process-env */
export type S3Prefix = 'temp' | 'media' | 'avatars' | 'covers' | 'banners';

const isTest = process.env.JEST_WORKER_ID;

export const CONTENT_BUCKET = isTest
  ? `content-${process.env.JEST_WORKER_ID}`
  : `content.${config.ROOT_DOMAIN}`;

export const TEMP: S3Prefix = 'temp';
export const MEDIA: S3Prefix = 'media';
export const AVATARS: S3Prefix = 'avatars';
export const COVERS: S3Prefix = 'covers';
export const BANNERS: S3Prefix = 'banners';
