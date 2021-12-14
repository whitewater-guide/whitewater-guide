/* eslint-disable node/no-process-env */
import { createHash } from 'crypto';
import { access, constants, createReadStream } from 'fs';
import { copy, emptyDir } from 'fs-extra';
import times from 'lodash/times';
import { Client } from 'minio';
import os from 'os';
import { resolve } from 'path';

import { CONTENT_BUCKET, S3Prefix, TEMP } from '~/s3';

const minioClient = new Client({
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  endPoint: process.env.MINIO_HOST!,
  port: Number(process.env.MINIO_PORT),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
  /* eslint-enable @typescript-eslint/no-non-null-assertion */
});

const createBucketIfNotExists = async (bucketName: string) => {
  let exists = true;
  try {
    exists = await minioClient.bucketExists(bucketName);
  } catch (err) {
    exists = false;
  }
  if (!exists) {
    await minioClient.makeBucket(bucketName, 'us-east-1');
    await minioClient.setBucketPolicy(
      bucketName,
      JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Action: [
              's3:GetBucketLocation',
              's3:ListBucketMultipartUploads',
              's3:ListBucket',
            ],
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Resource: [`arn:aws:s3:::${bucketName}`],
            Sid: '',
          },
          {
            Action: ['s3:GetObject'],
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Resource: [`arn:aws:s3:::${bucketName}/*`],
            Sid: '',
          },
          {
            Action: [
              's3:AbortMultipartUpload',
              's3:DeleteObject',
              's3:ListMultipartUploadParts',
              's3:PutObject',
            ],
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Resource: [`arn:aws:s3:::${bucketName}/temp/*`],
            Sid: '',
          },
        ],
      }),
    );
    console.info(`Minio had to create bucket ${bucketName}`);
  }
};

export const prepareMinio = async (forTests = false) => {
  console.info('Minio preparing');
  const numCpus = os.cpus() ? os.cpus().length : 1;
  const numWorkers = process.argv[2] ? Number(process.argv[2]) : numCpus;

  let buckets = ['content'];
  if (forTests) {
    buckets = buckets.concat(times(numWorkers).map((w) => `content-${w}`));
  }
  for (const bucket of buckets) {
    await createBucketIfNotExists(bucket);
  }
  console.info('Minio prepared');
};

const CONTENT_BUCKET_DIR = resolve(
  __dirname,
  '../../../dev-mount/minio/data',
  CONTENT_BUCKET,
);

export const resetTestMinio = async (clearOnly = false) => {
  const fixturesDir = resolve(__dirname, '../src/seeds/test/minio');
  await emptyDir(CONTENT_BUCKET_DIR);
  if (!clearOnly) {
    await copy(fixturesDir, CONTENT_BUCKET_DIR);
  }
};

/**
 * Checks if file exists in bucket and it's etag equals given value
 * @param {string} prefix
 * @param {string} fileName
 * @param {string} etag If defined, etags must match
 * @returns {Promise<boolean>}
 */
export const fileExistsInBucket = (
  prefix: S3Prefix,
  fileName: string,
  etag?: string,
) =>
  new Promise((res, reject) => {
    const file = resolve(CONTENT_BUCKET_DIR, prefix, fileName);
    access(file, constants.F_OK, (err) => {
      if (err) {
        res(false);
      } else if (etag) {
        const hash = createHash('md5');
        const stream = createReadStream(file);
        stream.on('error', reject);
        hash.once('readable', () => {
          res((hash.read() as Buffer).toString('hex') === etag);
        });
        stream.pipe(hash);
      } else {
        res(true);
      }
    });
  });

export const copyToS3 = async (
  prefix: S3Prefix,
  src: string,
  destFilename: string,
) => {
  await copy(src, resolve(CONTENT_BUCKET_DIR, prefix, destFilename));
};

export const copyToTemp = async (src: string, destFilename: string) => {
  await copyToS3(TEMP, src, destFilename);
};
