import log from '@log';
import { CopyConditions } from 'minio';
import { TEMP } from './buckets';
import { minioClient } from './client';

const logger = log.child({ module: 'minio' });

export const getTempPostPolicy = async (key?: string, uploadedBy?: string) => {
  const policy = minioClient.newPostPolicy();
  const expires = new Date();
  // Policy expires in 24 hours
  expires.setSeconds(24 * 60 * 60);
  policy.setExpires(expires);
  policy.setContentType('image/*');
  policy.setBucket(TEMP);
  if (key) {
    policy.setKeyStartsWith(key);
  }
  // Only allow content size in range 10KB to 10MB in production
  const minSize = process.env.NODE_ENV === 'production' ? 10 * 1024 : 1;
  policy.setContentLengthRange(minSize, 10 * 1024 * 1024);
  if (uploadedBy) {
    // @ts-ignore
    policy.policy.conditions.push([
      'eq',
      '$x-amz-meta-uploaded-by',
      uploadedBy,
    ]);
    // @ts-ignore
    policy.formData['x-amz-meta-uploaded-by'] = uploadedBy;
  }
  // console.log(JSON.stringify(policy, null, 2))
  let { postURL, formData } = await minioClient.presignedPostPolicy(policy);
  postURL = postURL
    .replace(/https?:\/\//, '')
    .replace(
      `${process.env.MINIO_HOST!}:${process.env.MINIO_PORT!}`,
      `${process.env.PROTOCOL!}://${process.env.MINIO_DOMAIN}`,
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
export const moveTempImage = async (
  url: string,
  toBucket: string,
): Promise<void> => {
  const filename = url.split('/').pop();
  try {
    await minioClient.copyObject(
      toBucket,
      filename!,
      `/${TEMP}/${filename}`,
      new CopyConditions(),
    );
    await minioClient.removeObject(TEMP, filename!);
  } catch (e) {
    logger.error({
      error: e,
      message: 'Error while moving file',
      extra: { filename },
    });
  }
};
