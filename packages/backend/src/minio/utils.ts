import { CopyConditions } from 'minio';
import { MINIO_URL, TEMP, TEMP_BUCKET_URL } from './buckets';
import { minioClient } from './client';

export const getTempPostPolicy = async () => {
  const policy = minioClient.newPostPolicy();
  const expires = new Date();
  // Policy expires in 24 hours
  expires.setSeconds(24 * 60 * 60);
  policy.setExpires(expires);
  policy.setContentType('image/*');
  policy.setBucket(TEMP);
  // Only allow content size in range 10KB to 10MB.
  policy.setContentLengthRange(10 * 1024, 10 * 1024 * 1024);
  const { postURL: url, formData } = await minioClient.presignedPostPolicy(policy);
  const postURL = url
    .replace(/https?:\/\//, '')
    .replace(
      `${process.env.MINIO_HOST!}:9000`,
      `${process.env.PROTOCOL!}://${process.env.APP_DOMAIN!}`,
    );
  return { postURL, formData };
};

/**
 * Checks if full image URL belongs to certain bucket
 * @param {string} imageURL
 * @param {string} bucket
 * @returns {boolean}
 */
const isURLInBucket = (imageURL: string, bucket: string) => {
  const bucketUrl = `${MINIO_URL}/${bucket}`;
  return imageURL.startsWith(bucketUrl);
};

/**
 * Moves uploaded image from temp bucket to target bucket
 * If url does not belong to temp bucket - returns url
 * @param {string} url URL of image
 * @param {string} toBucket Where image should be placed (avatars? media?)
 * @returns {Promise<string>} URL in target bucket, or original url, if it wasn't from temp bucket
 */
export const moveTempImage = async (url: string, toBucket: string): Promise<string> => {
  if (isURLInBucket(url, TEMP)) {
    const filename = url.split('/').pop();
    await minioClient.copyObject(TEMP, filename!, `/${toBucket}/${filename}`, new CopyConditions());
    await minioClient.removeObject(TEMP, filename!);
    return url.replace(TEMP_BUCKET_URL, `${MINIO_URL}/${toBucket}`);
  }
  return url;
};
