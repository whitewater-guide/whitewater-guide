import log from '@log';
import { MAX_FILE_SIZE, MIN_FILE_SIZE } from '@whitewater-guide/commons';
import { UserInputError } from 'apollo-server-errors';
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
  const minSize = process.env.NODE_ENV === 'production' ? MIN_FILE_SIZE : 1;
  policy.setContentLengthRange(minSize, MAX_FILE_SIZE);
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

export const renameFile = (from: string, to?: string) => {
  if (from.indexOf('/') >= 0) {
    throw new Error('from file name expected, but found: ' + from);
  }
  if (!to) {
    return from;
  }
  if (to.indexOf('/') >= 0) {
    throw new Error('to file name expected, but found: ' + to);
  }
  const [fromName, fromExt] = from.split('.');
  const [toName, toExt] = to.split('.');
  if (fromExt && toExt && fromExt !== toExt) {
    throw new Error(`attempt to change file extension: ${from} -> ${to}`);
  }
  const ext = toExt || fromExt;
  return `${toName}.${ext}`;
};

/**
 * Moves uploaded image from temp bucket to target bucket
 * If url does not belong to temp bucket - ignores it
 * @param {string} url URL of image (or just filename)
 * @param {string} toBucket Where image should be placed (avatars? media?)
 * @param {string} newFileName - optional, maybe without extension, in which case original
 * extension will be kept
 * @returns {Promise<void>}
 */
export const moveTempImage = async (
  url: string,
  toBucket: string,
  newFileName?: string,
): Promise<void> => {
  try {
    const filename = url.split('/').pop();
    if (!filename) {
      throw new Error('moveTempImage: filename not found');
    }
    const newFile = renameFile(filename, newFileName);
    await minioClient.copyObject(
      toBucket,
      newFile,
      `/${TEMP}/${filename}`,
      new CopyConditions(),
    );
    await minioClient.removeObject(TEMP, filename);
  } catch (e) {
    logger.error({
      error: e,
      message: 'Error while moving file',
      extra: { url, newFileName },
    });
  }
};

export const getLocalFileName = (url?: string | null): string | null => {
  if (!url) {
    return null;
  }
  const { PROTOCOL, MINIO_DOMAIN } = process.env;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    if (url.startsWith(`${PROTOCOL}://${MINIO_DOMAIN}/`)) {
      return url.split('/').pop() || null;
    }
    throw new UserInputError('incorrect file url', { url });
  }
  return url;
};
