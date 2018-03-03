import log from '../log';
import { AVATARS, MEDIA, TEMP } from './buckets';
import { minioClient } from './client';

const createIfNotExists = async (bucketName: string) => {
  let exists = true;
  try {
    await minioClient.bucketExists(bucketName);
  } catch (err) {
    exists = false;
  }
  if (!exists) {
    await minioClient.makeBucket(bucketName, 'eu-west-1');
    log.info(`Minio had to create bucket ${bucketName}`);
  }
};

export const initMinio = async () => {
  log.info('Minio initializing');
  const theOnlyBucket = process.env.MINIO_PROXY_PATH!;
  await Promise.all([TEMP, MEDIA, AVATARS].map(bucket => createIfNotExists(theOnlyBucket)));
  await minioClient.setBucketPolicy(theOnlyBucket, TEMP + '/', 'writeonly');
  await minioClient.setBucketPolicy(theOnlyBucket, MEDIA + '/', 'readonly');
  await minioClient.setBucketPolicy(theOnlyBucket, AVATARS + '/', 'readonly');
  log.info('Minio init complete');
};
