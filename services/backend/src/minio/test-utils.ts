import {
  AVATARS,
  BANNERS,
  BUCKETS_TEST_PREFIX,
  COVERS,
  MEDIA,
  TEMP,
} from './buckets';
import { access, constants, createReadStream, readdir } from 'fs';
import { copy, emptyDir } from 'fs-extra';

import { createHash } from 'crypto';
import { resolve } from 'path';

export const BUCKETS_DIR = resolve(
  __dirname,
  '../../../../dev-mount/minio/data',
);

export const TEMP_BUCKET_DIR = resolve(BUCKETS_DIR, TEMP);
export const MEDIA_BUCKET_DIR = resolve(BUCKETS_DIR, MEDIA);
export const AVATARS_BUCKET_DIR = resolve(BUCKETS_DIR, AVATARS);
export const COVERS_BUCKET_DIR = resolve(BUCKETS_DIR, COVERS);
export const BANNERS_BUCKET_DIR = resolve(BUCKETS_DIR, BANNERS);

export const FIXTURES_BUCKETS_DIR = resolve(__dirname, '../seeds/test/minio');

export const resetTestMinio = async (clearOnly = false) => {
  await Promise.all([
    emptyDir(TEMP_BUCKET_DIR),
    emptyDir(MEDIA_BUCKET_DIR),
    emptyDir(AVATARS_BUCKET_DIR),
    emptyDir(COVERS_BUCKET_DIR),
    emptyDir(BANNERS_BUCKET_DIR),
  ]);
  if (!clearOnly) {
    await Promise.all([
      copy(
        resolve(FIXTURES_BUCKETS_DIR, TEMP.replace(BUCKETS_TEST_PREFIX, '')),
        TEMP_BUCKET_DIR,
      ),
      copy(
        resolve(FIXTURES_BUCKETS_DIR, MEDIA.replace(BUCKETS_TEST_PREFIX, '')),
        MEDIA_BUCKET_DIR,
      ),
      copy(
        resolve(FIXTURES_BUCKETS_DIR, AVATARS.replace(BUCKETS_TEST_PREFIX, '')),
        AVATARS_BUCKET_DIR,
      ),
      copy(
        resolve(FIXTURES_BUCKETS_DIR, COVERS.replace(BUCKETS_TEST_PREFIX, '')),
        COVERS_BUCKET_DIR,
      ),
      copy(
        resolve(FIXTURES_BUCKETS_DIR, BANNERS.replace(BUCKETS_TEST_PREFIX, '')),
        BANNERS_BUCKET_DIR,
      ),
    ]);
  }
};

export const countFilesInBucket = (bucketName: string) =>
  new Promise((res, reject) => {
    const bucketPath = resolve(BUCKETS_DIR, bucketName);
    readdir(bucketPath, (err, files) => {
      if (err) {
        if (err.code === 'ENOENT') {
          // Buckets are not real folders, so empty bucket does not exist as folder
          res(0);
        } else {
          reject(err);
        }
      } else {
        res(files.length);
      }
    });
  });

/**
 * Checks if file exists in bucket and it's etag equals given value
 * @param {string} bucketName
 * @param {string} fileName
 * @param {string} etag If defined, etags must match
 * @returns {Promise<boolean>}
 */
export const fileExistsInBucket = (
  bucketName: string,
  fileName: string,
  etag?: string,
) =>
  new Promise((res, reject) => {
    const file = resolve(BUCKETS_DIR, bucketName, fileName);
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
