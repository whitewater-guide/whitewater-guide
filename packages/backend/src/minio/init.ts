import log from '../log';
import { AVATARS, BANNERS, COVERS, MEDIA, TEMP } from './buckets';
import { minioClient } from './client';
import { AVATARS_POLICY, BANNERS_POLICY, COVERS_POLICY, MEDIA_POLICY, TEMP_POLICY } from './policies';

const createIfNotExists = async (bucketName: string) => {
  let exists = true;
  try {
    exists = await minioClient.bucketExists(bucketName);
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
  await minioClient.setBucketPolicy(TEMP, JSON.stringify(TEMP_POLICY));
  await minioClient.setBucketPolicy(MEDIA, JSON.stringify(MEDIA_POLICY));
  await minioClient.setBucketPolicy(AVATARS, JSON.stringify(AVATARS_POLICY));
  await minioClient.setBucketPolicy(COVERS, JSON.stringify(COVERS_POLICY));
  await minioClient.setBucketPolicy(BANNERS, JSON.stringify(BANNERS_POLICY));
  log.info('Minio init complete');
};
