export type Bucket = 'temp' | 'media' | 'avatars' | 'covers' | 'banners';

const isTest = process.env.JEST_WORKER_ID;
export const BUCKETS_TEST_PREFIX = isTest
  ? `jest-${process.env.JEST_WORKER_ID}-`
  : '';

export const TEMP = `${BUCKETS_TEST_PREFIX}temp`;
export const MEDIA = `${BUCKETS_TEST_PREFIX}media`;
export const AVATARS = `${BUCKETS_TEST_PREFIX}avatars`;
export const COVERS = `${BUCKETS_TEST_PREFIX}covers`;
export const BANNERS = `${BUCKETS_TEST_PREFIX}banners`;

export const MINIO_URL = `${process.env.PROTOCOL}://${process.env.MINIO_DOMAIN}`;

export const TEMP_BUCKET_URL = `${MINIO_URL}/${TEMP}`;
export const MEDIA_BUCKET_URL = `${MINIO_URL}/${MEDIA}`;
export const AVATARS_BUCKET_URL = `${MINIO_URL}/${AVATARS}`;
export const COVERS_BUCKET_URL = `${MINIO_URL}/${COVERS}`;
export const BANNERS_BUCKET_URL = `${MINIO_URL}/${BANNERS}`;
