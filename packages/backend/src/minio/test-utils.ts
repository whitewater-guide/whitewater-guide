import { createHash } from 'crypto';
import { access, constants, createReadStream, readdir } from 'fs';
import * as path from 'path';
import { BUCKETS_DIR } from './buckets';

export const countFilesInBucket = (bucketName: string) => new Promise((resolve, reject) => {
  const bucketPath = path.resolve(BUCKETS_DIR, bucketName);
  readdir(bucketPath, ((err, files) => {
    if (err) {
      if (err.code === 'ENOENT') { // Buckets are not real folders, so empty bucket does not exist as folder
        resolve(0);
      } else {
        reject(err);
      }
    } else {
      resolve(files.length);
    }
  }));
});

/**
 * Checks if file exists in bucket and it's etag equals given value
 * @param {string} bucketName
 * @param {string} fileName
 * @param {string} etag
 * @returns {Promise<boolean>}
 */
export const fileExistsInBucket = (bucketName: string, fileName: string, etag: string) =>
  new Promise((resolve, reject) => {
    const file = path.resolve(BUCKETS_DIR, bucketName, fileName);
    access(file, constants.F_OK, (err) => {
      if (err) {
        resolve(false);
      } else {
        const hash = createHash('md5');
        const stream = createReadStream(file);
        stream.on('error', reject);
        hash.once('readable', () => {
          resolve((hash.read() as Buffer).toString('hex') === etag);
        });
        stream.pipe(hash);
      }
    });
  });
