import log from '@log';
import { CopyConditions } from 'minio';
import { TEMP } from './buckets';
import { minioClient } from './client';

const logger = log.child({ module: 'minio' });

export const getTempPostPolicy = async (key?: string) => {
  const policy = minioClient.newPostPolicy();
  const expires = new Date();
  // Policy expires in 24 hours
  expires.setSeconds(24 * 60 * 60);
  policy.setExpires(expires);
  policy.setContentType('image/*');
  policy.setBucket(TEMP);
  if (key) {
    policy.setKey(key);
  }
  // Only allow content size in range 10KB to 10MB.
  policy.setContentLengthRange(10 * 1024, 10 * 1024 * 1024);
  const { postURL: url, formData } = await minioClient.presignedPostPolicy(policy);
  const postURL = url
    .replace(/https?:\/\//, '')
    .replace(
      `${process.env.MINIO_HOST!}:${process.env.MINIO_PORT!}`,
      `${process.env.PROTOCOL!}://${process.env.APP_DOMAIN!}/${process.env.MINIO_PROXY_PATH}`,
    );
  return { postURL, formData };
};

/**
 * Moves uploaded image from temp bucket to target bucket
 * If url does not belong to temp bucket - ignores it
 * @param {string} url URL of image (or just filename)
 * @param {string} toBucket Where image should be placed (avatars? media?)
 * @returns {Promise<void>}
 */
export const moveTempImage = async (url: string, toBucket: string): Promise<void> => {
  const filename = url.split('/').pop();
  try {
    await minioClient.copyObject(toBucket, filename!, `/${TEMP}/${filename}`, new CopyConditions());
    await minioClient.removeObject(TEMP, filename!);
  } catch (e) {
    logger.error(`Error while moving file ${filename}: ${e.message}`);
  }
};
