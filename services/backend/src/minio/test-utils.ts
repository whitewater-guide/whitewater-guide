import { createHash } from 'crypto';
import { access, constants, createReadStream, readdir } from 'fs';
import { copy, emptyDir } from 'fs-extra';
import path from 'path';
import { AVATARS, BANNERS, COVERS, MEDIA, TEMP } from './buckets';

export const BUCKETS_DIR = path.resolve(
  __dirname,
  '../../../../dev-mount/minio/data',
);

export const TEMP_BUCKET_DIR = path.resolve(BUCKETS_DIR, TEMP);
export const MEDIA_BUCKET_DIR = path.resolve(BUCKETS_DIR, MEDIA);
export const AVATARS_BUCKET_DIR = path.resolve(BUCKETS_DIR, AVATARS);
export const COVERS_BUCKET_DIR = path.resolve(BUCKETS_DIR, COVERS);
export const BANNERS_BUCKET_DIR = path.resolve(BUCKETS_DIR, BANNERS);

export const FIXTURES_BUCKETS_DIR = path.resolve(
  __dirname,
  '../seeds/test/minio',
);

export const resetTestMinio = async (clearOnly = false) => {
  await Promise.all([
    emptyDir(TEMP_BUCKET_DIR),
    emptyDir(MEDIA_BUCKET_DIR),
    emptyDir(AVATARS_BUCKET_DIR),
    emptyDir(COVERS_BUCKET_DIR),
    emptyDir(BANNERS_BUCKET_DIR),
  ]);
  if (!clearOnly) {
    await copy(FIXTURES_BUCKETS_DIR, BUCKETS_DIR);
  }
};

export const countFilesInBucket = (bucketName: string) =>
  new Promise((resolve, reject) => {
    const bucketPath = path.resolve(BUCKETS_DIR, bucketName);
    readdir(bucketPath, (err, files) => {
      if (err) {
        if (err.code === 'ENOENT') {
          // Buckets are not real folders, so empty bucket does not exist as folder
          resolve(0);
        } else {
          reject(err);
        }
      } else {
        resolve(files.length);
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
  new Promise((resolve, reject) => {
    const file = path.resolve(BUCKETS_DIR, bucketName, fileName);
    access(file, constants.F_OK, (err) => {
      if (err) {
        resolve(false);
      } else if (etag) {
        const hash = createHash('md5');
        const stream = createReadStream(file);
        stream.on('error', reject);
        hash.once('readable', () => {
          resolve((hash.read() as Buffer).toString('hex') === etag);
        });
        stream.pipe(hash);
      } else {
        resolve(true);
      }
    });
  });
