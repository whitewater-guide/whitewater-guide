export const TEMP = 'temp';
export const MEDIA = 'media';
export const AVATARS = 'avatars';

export const MINIO_URL = `${process.env.PROTOCOL}://${process.env.APP_DOMAIN!}/${process.env.MINIO_PROXY_PATH}`;

export const TEMP_BUCKET_URL = `${MINIO_URL}/${TEMP}`;
export const MEDIA_BUCKET_URL = `${MINIO_URL}/${MEDIA}`;
export const AVATARS_BUCKET_URL = `${MINIO_URL}/${AVATARS}`;
