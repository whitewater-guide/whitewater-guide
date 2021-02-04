import { MAX_FILE_SIZE, MIN_FILE_SIZE } from '@whitewater-guide/commons';
import AWS from 'aws-sdk';

import config from '~/config';
import log from '~/log';

import { Imgproxy } from './imgproxy';
import { CONTENT_BUCKET, S3Prefix, TEMP } from './paths';

const logger = log.child({ module: 's3' });

export interface PostPolicy {
  postURL: string;
  formData: { [key: string]: any };
}

export class S3Client {
  private _client: AWS.S3 | undefined;

  private get client() {
    if (!this._client) {
      this._client = new AWS.S3(config.s3);
    }
    return this._client;
  }

  public async getTempPostPolicy(
    key?: string | null,
    uploadedBy?: string,
  ): Promise<PostPolicy> {
    // Only allow content size in range 10KB to 10MB in production
    const minSize = config.NODE_ENV === 'production' ? MIN_FILE_SIZE : 1;

    const params: AWS.S3.PresignedPost.Params = {
      Bucket: CONTENT_BUCKET,
      Expires: 30 * 60, // 30 minutes
      Conditions: [
        ['starts-with', '$Content-Type', 'image/'],
        ['starts-with', '$key', key ? `${TEMP}/${key}` : `${TEMP}/`],
        ['content-length-range', minSize, MAX_FILE_SIZE],
      ],
    };

    if (uploadedBy) {
      params.Conditions!.push(['eq', '$x-amz-meta-uploaded-by', uploadedBy]);
      params.Fields = { 'x-amz-meta-uploaded-by': uploadedBy };
    }

    return new Promise((resolve, reject) => {
      this.client.createPresignedPost(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve({ postURL: data.url, formData: data.fields });
        }
      });
    });
  }

  public renameFile(from: string, to?: string) {
    if (from.indexOf('/') >= 0) {
      throw new Error('from file name expected, but found: ' + from);
    }
    if (!to) {
      return from;
    }
    if (to.indexOf('/') >= 0) {
      throw new Error('to file name expected, but found: ' + to);
    }
    const [_, fromExt] = from.split('.');
    const [toName, toExt] = to.split('.');
    if (fromExt && toExt && fromExt !== toExt) {
      throw new Error(`attempt to change file extension: ${from} -> ${to}`);
    }
    const ext = toExt || fromExt;
    return `${toName}.${ext}`;
  }

  /**
   * Moves uploaded image from temp directory bucket to specified path
   * If url does not belong to temp directory - ignores it
   * @param {string} url URL of image (or just filename)
   * @param {string} toPrefix Where image should be placed (avatars? media?)
   * @param {string} newFileName - optional, maybe without extension, in which case original
   * extension will be kept
   * @returns {Promise<void>}
   */
  public async moveTempImage(
    url: string,
    toPrefix: S3Prefix,
    newFileName?: string,
  ): Promise<void> {
    try {
      const filename = url.split('/').pop();
      if (!filename) {
        throw new Error('moveTempImage: filename not found');
      }
      const newFile = this.renameFile(filename, newFileName);
      await this.client
        .copyObject({
          CopySource: `/${CONTENT_BUCKET}/${TEMP}/${filename}`,
          Bucket: CONTENT_BUCKET,
          Key: `${toPrefix}/${newFile}`,
        })
        .promise();
      await this.client
        .deleteObject({ Bucket: CONTENT_BUCKET, Key: `${TEMP}/${filename}` })
        .promise();
    } catch (e) {
      logger.error({
        error: e,
        message: 'Error while moving file',
        extra: { url, newFileName },
      });
    }
  }

  /**
   * Gets local filename (just filename, not s3 key prefixes) for various URLs that we get as mutation inputs
   * It's quite complicated because it handles various legacy situations, check out tests
   * @param url
   */
  public getLocalFileName(url?: string | null): string | null {
    if (!url) {
      return null;
    }
    if (url.startsWith(config.contentPublicURL)) {
      return Imgproxy.decodeContentURL(url);
    }
    const path = url.split('/').pop();
    if (!path) {
      return null;
    }
    // For some reason presigned s3 post results in locating where key is URL encoded
    // e.g. https://s3.amazonaws.com/content.whitewater-dev.com/temp%2F1bd0c8e0-6702-11eb-bb16-af49de2e72bb.jpg
    return decodeURIComponent(path).split('/').pop() ?? null;
  }

  public async removeFile(prefix: S3Prefix, filename: string) {
    await this.client
      .deleteObject({ Bucket: CONTENT_BUCKET, Key: `${prefix}/${filename}` })
      .promise();
  }

  public async statObject(prefix: S3Prefix, filename: string) {
    return this.client
      .headObject({ Bucket: CONTENT_BUCKET, Key: `${prefix}/${filename}` })
      .promise();
  }

  public streamObject(prefix: S3Prefix, filename: string) {
    return this.client
      .getObject({ Bucket: CONTENT_BUCKET, Key: `${prefix}/${filename}` })
      .createReadStream();
  }

  public listObjects(prefix: S3Prefix) {
    return this.client
      .listObjectsV2({ Bucket: CONTENT_BUCKET, Prefix: prefix })
      .createReadStream();
  }
}

export const s3Client = new S3Client();
