export type Bucket = 'temp' | 'media' | 'avatars' | 'covers' | 'banners';

export const TEMP = 'temp';
export const MEDIA = 'media';
export const AVATARS = 'avatars';
export const COVERS = 'covers';
export const BANNERS = 'banners';

export const MINIO_URL = `${process.env.PROTOCOL}://${
  process.env.MINIO_DOMAIN
}`;

export const TEMP_BUCKET_URL = `${MINIO_URL}/${TEMP}`;
export const MEDIA_BUCKET_URL = `${MINIO_URL}/${MEDIA}`;
export const AVATARS_BUCKET_URL = `${MINIO_URL}/${AVATARS}`;
export const COVERS_BUCKET_URL = `${MINIO_URL}/${COVERS}`;
export const BANNERS_BUCKET_URL = `${MINIO_URL}/${BANNERS}`;
