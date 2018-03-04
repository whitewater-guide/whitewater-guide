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
  await Promise.all([TEMP, MEDIA, AVATARS].map(bucket => createIfNotExists(bucket)));
  await minioClient.setBucketPolicy(TEMP, '', 'writeonly');
  await minioClient.setBucketPolicy(MEDIA, '', 'readonly');
  await minioClient.setBucketPolicy(AVATARS, '', 'readonly');
  log.info('Minio init complete');
};
