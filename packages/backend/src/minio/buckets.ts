import * as path from 'path';

export const TEMP = 'temp';
export const MEDIA = 'media';
export const AVATARS = 'avatars';

export const MINIO_URL = `${process.env.PROTOCOL}://${process.env.APP_DOMAIN!}/${process.env.MINIO_PROXY_PATH}`;

export const TEMP_BUCKET_URL = `${MINIO_URL}/${TEMP}`;
export const MEDIA_BUCKET_URL = `${MINIO_URL}/${MEDIA}`;
export const AVATARS_BUCKET_URL = `${MINIO_URL}/${AVATARS}`;

//
// Directories below are for test purposes only
//
export const BUCKETS_DIR = path.resolve(__dirname, '../../../minio/data', process.env.MINIO_PROXY_PATH!);

export const TEMP_BUCKET_DIR = path.resolve(BUCKETS_DIR, TEMP);
export const MEDIA_BUCKET_DIR = path.resolve(BUCKETS_DIR, MEDIA);
export const AVATARS_BUCKET_DIR = path.resolve(BUCKETS_DIR, AVATARS);
