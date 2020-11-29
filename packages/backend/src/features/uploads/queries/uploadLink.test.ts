import {
  fakeContext,
  fileExistsInBucket,
  resetTestMinio,
  runQuery,
} from '@test';
import superagent from 'superagent';

import { holdTransaction, rollbackTransaction } from '~/db';
import { CONTENT_BUCKET, TEMP } from '~/s3';
import { TEST_USER, TEST_USER_ID } from '~/seeds/test/01_users';

const query = `
  query uploadLink {
    uploadLink {
      postURL
      formData
      key
    }
  }
`;

const variables = {};

beforeEach(async () => {
  await holdTransaction();
  await resetTestMinio();
});
afterEach(rollbackTransaction);
afterAll(() => resetTestMinio(true));

describe('response', () => {
  it('should return correct result', async () => {
    const { MINIO_HOST, MINIO_PORT } = process.env;
    const result = await runQuery(query, variables, fakeContext(TEST_USER));
    expect(result.errors).toBeUndefined();
    expect(result.data!.uploadLink).toEqual({
      postURL: `http://${MINIO_HOST}:${MINIO_PORT}/${CONTENT_BUCKET}`,
      formData: {
        bucket: CONTENT_BUCKET,
        Policy: expect.any(String),
        'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
        'X-Amz-Credential': expect.any(String),
        'X-Amz-Date': expect.stringMatching(/[0-9TZ]+/),
        'X-Amz-Signature': expect.any(String),
        'x-amz-meta-uploaded-by': TEST_USER_ID,
      },
      key: expect.any(String),
    });
  });
});

describe('uploads', () => {
  let postURL: string;
  let formData: any;
  let key: string;

  beforeEach(async () => {
    const result = await runQuery(query, variables, fakeContext(TEST_USER));
    postURL = result.data!.uploadLink.postURL;
    formData = result.data!.uploadLink.formData;
    key = result.data!.uploadLink.key;
  });

  it.each([
    ['without extensions', '', '47b0b3eb4caad3eda2040a9d314546f1'],
    ['with .jpg extension', '.jpg', '47b0b3eb4caad3eda2040a9d314546f1'],
    ['with .png extension', '.png', '007bf86b9acef7ed24ac2858a182c0e0'],
  ])('should upload new file %s', async (_, extension, etag) => {
    const req = superagent.post(postURL);
    const data = {
      ...formData,
      key: `${key}${extension}`,
      'Content-Type': 'image/*',
    };

    Object.entries(data).forEach(([k, v]) => req.field(k, v as any));
    req.attach(
      'file',
      `${__dirname}/__tests__/upload_me${extension}`,
      `upload_me${extension}`,
    );
    const { MINIO_HOST, MINIO_PORT } = process.env;
    await expect(req).resolves.toMatchObject({
      status: 204,
      header: {
        location: `http://${MINIO_HOST}:${MINIO_PORT}/${CONTENT_BUCKET}/${key}${extension}`,
        etag: expect.any(String),
      },
    });

    const filename = key.replace(`${TEMP}/`, '');
    await expect(
      fileExistsInBucket(TEMP, `${filename}${extension}`, etag),
    ).resolves.toBe(true);
  });

  it('should not upload when key does not starts with given prefix', async () => {
    const jpgReq = superagent.post(postURL);
    const jpgData = { ...formData, key: 'upload_me.jpg' };
    Object.entries(jpgData).forEach(([k, v]) => jpgReq.field(k, v as any));
    jpgReq.attach(
      'file',
      `${__dirname}/__tests__/upload_me.jpg`,
      'upload_me.jpg',
    );
    await expect(jpgReq).rejects.toThrowError('Forbidden');
  });
});
