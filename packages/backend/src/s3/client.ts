import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListBucketsCommand,
  paginateListObjectsV2,
  S3Client as AWSS3Client,
} from '@aws-sdk/client-s3';
import {
  createPresignedPost,
  PresignedPostOptions,
} from '@aws-sdk/s3-presigned-post';
import { MAX_FILE_SIZE, MIN_FILE_SIZE } from '@whitewater-guide/commons';
import { Readable } from 'stream';
import { Required } from 'utility-types';

import config from '~/config';
import log from '~/log';

import { Imgproxy } from './imgproxy';
import { CONTENT_BUCKET, S3Prefix, TEMP } from './paths';

const logger = log.child({ module: 's3' });

export interface PostPolicy {
  postURL: string;
  formData: { [key: string]: any };
}

export type PostPolicyVersion = 'V3';

export class S3Client {
  private _client: AWSS3Client | undefined;

  private get client(): AWSS3Client {
    if (!this._client) {
      this._client = new AWSS3Client(config.s3 ?? {});
    }
    return this._client;
  }

  public async getTempPostPolicy(
    key?: string | null,
    uploadedBy?: string,
    version?: PostPolicyVersion,
  ): Promise<PostPolicy> {
    // Only allow content size in range 10KB to 10MB in production
    const minSize = config.NODE_ENV === 'production' ? MIN_FILE_SIZE : 1;

    const params: Required<PresignedPostOptions, 'Conditions'> = {
      Bucket: CONTENT_BUCKET,
      Expires: 30 * 60, // 30 minutes
      Conditions: [
        ['starts-with', '$key', key ? `${TEMP}/${key}` : `${TEMP}/`],
        ['content-length-range', minSize, MAX_FILE_SIZE],
      ],
      Key: `${TEMP}/\${filename}`,
    };
    // Legacy mobile clients do not add Content-Type and so this is temporary disabled
    if (version === 'V3') {
      params.Conditions.unshift(['starts-with', '$Content-Type', 'image/']);
    }

    if (uploadedBy) {
      params.Conditions.push(['eq', '$x-amz-meta-uploaded-by', uploadedBy]);
      params.Fields = { 'x-amz-meta-uploaded-by': uploadedBy };
    }

    const data = await createPresignedPost(this.client, params);

    return { postURL: data.url, formData: data.fields };
  }

  public renameFile(from: string, to?: string) {
    logger.debug({ from, to }, 'rename file');
    if (from.indexOf('/') >= 0) {
      throw new Error(`from file name expected, but found: ${from}`);
    }
    if (!to) {
      return from;
    }
    if (to.indexOf('/') >= 0) {
      throw new Error(`to file name expected, but found: ${to}`);
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
    logger.debug({ url, toPrefix, newFileName }, 'move temp image');
    try {
      const filename = this.getLocalFileName(url);
      if (!filename) {
        throw new Error('moveTempImage: filename not found');
      }
      const newFile = this.renameFile(filename, newFileName);
      const copyCmd = new CopyObjectCommand({
        CopySource: `/${CONTENT_BUCKET}/${TEMP}/${filename}`,
        Bucket: CONTENT_BUCKET,
        Key: `${toPrefix}/${newFile}`,
      });
      await this.client.send(copyCmd);
      const deleteCmd = new DeleteObjectCommand({
        Bucket: CONTENT_BUCKET,
        Key: `${TEMP}/${filename}`,
      });
      await this.client.send(deleteCmd);
    } catch (e) {
      logger.error({
        error: e as Error,
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
    logger.debug({ prefix, filename }, 'remove file');
    const cmd = new DeleteObjectCommand({
      Bucket: CONTENT_BUCKET,
      Key: `${prefix}/${filename}`,
    });
    await this.client.send(cmd);
  }

  public async statObject(prefix: S3Prefix, filename: string) {
    const cmd = new HeadObjectCommand({
      Bucket: CONTENT_BUCKET,
      Key: `${prefix}/${filename}`,
    });
    return this.client.send(cmd);
  }

  public async streamObject(
    prefix: S3Prefix,
    filename: string,
  ): Promise<Readable> {
    const cmd = new GetObjectCommand({
      Bucket: CONTENT_BUCKET,
      Key: `${prefix}/${filename}`,
    });
    // return this.client.getObject().createReadStream();
    const item = await this.client.send(cmd);
    return item.Body as Readable;
  }

  public async listObjects(prefix: S3Prefix) {
    const paginator = paginateListObjectsV2(
      {
        client: this.client,
        pageSize: 1000,
      },
      {
        Bucket: CONTENT_BUCKET,
        Prefix: prefix,
      },
    );

    const result = [];
    for await (const page of paginator) {
      result.push(...(page.Contents ?? []));
    }
    return result;
  }

  public async listBuckets() {
    const cmd = new ListBucketsCommand({});
    return this.client.send(cmd);
  }
}

export const s3Client = new S3Client();
