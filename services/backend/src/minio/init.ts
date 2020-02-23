import log from '@log';
import { AVATARS, BANNERS, COVERS, MEDIA, TEMP } from './buckets';
import { minioClient } from './client';
import {
  avatarsPolicy,
  bannersPolicy,
  coversPolicy,
  mediaPolicy,
  tempPolicy,
} from './policies';

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
  await Promise.all(
    [TEMP, MEDIA, AVATARS, COVERS, BANNERS].map((bucket) =>
      createIfNotExists(bucket),
    ),
  );
  await minioClient.setBucketPolicy(TEMP, JSON.stringify(tempPolicy(TEMP)));
  await minioClient.setBucketPolicy(MEDIA, JSON.stringify(mediaPolicy(MEDIA)));
  await minioClient.setBucketPolicy(
    AVATARS,
    JSON.stringify(avatarsPolicy(AVATARS)),
  );
  await minioClient.setBucketPolicy(
    COVERS,
    JSON.stringify(coversPolicy(COVERS)),
  );
  await minioClient.setBucketPolicy(
    BANNERS,
    JSON.stringify(bannersPolicy(BANNERS)),
  );
  log.info('Minio init complete');
};
