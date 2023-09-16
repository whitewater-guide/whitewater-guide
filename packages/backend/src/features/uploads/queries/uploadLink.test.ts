import { PostPolicyVersion } from '@whitewater-guide/schema';
import { gql } from 'graphql-tag';
import superagent from 'superagent';

import { holdTransaction, rollbackTransaction } from '../../../db/index';
import { CONTENT_BUCKET, TEMP } from '../../../s3/index';
import { TEST_USER, TEST_USER_ID } from '../../../seeds/test/01_users';
import {
  fakeContext,
  fileExistsInBucket,
  resetTestMinio,
} from '../../../test/index';
import type { UploadLinkQueryVariables } from './uploadLink.test.generated';
import { testUploadLink } from './uploadLink.test.generated';

const _query = gql`
  query uploadLink($version: PostPolicyVersion) {
    uploadLink(version: $version) {
      postURL
      formData
      key
    }
  }
`;

beforeEach(async () => {
  await holdTransaction();
  await resetTestMinio();
});
afterEach(rollbackTransaction);
afterAll(() => resetTestMinio(true));

describe('response', () => {
  it.each<[string, UploadLinkQueryVariables]>([
    ['current version', { version: PostPolicyVersion.V3 }],
    ['legacy mobile version', {}],
  ])('should return correct result for %s', async (_, vars) => {
    const { MINIO_HOST, MINIO_PORT } = process.env;
    const result = await testUploadLink(vars, fakeContext(TEST_USER));
    expect(result.errors).toBeUndefined();
    expect(result.data?.uploadLink).toEqual({
      postURL: `http://${MINIO_HOST}:${MINIO_PORT}/${CONTENT_BUCKET}`,
      formData: {
        bucket: CONTENT_BUCKET,
        Policy: expect.any(String),
        'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
        'X-Amz-Credential': expect.any(String),
        'X-Amz-Date': expect.stringMatching(/[0-9TZ]+/),
        'X-Amz-Signature': expect.any(String),
        'x-amz-meta-uploaded-by': TEST_USER_ID,
        // eslint-disable-next-line no-template-curly-in-string
        key: 'temp/${filename}',
      },
      key: expect.any(String),
    });
  });
});

describe('uploads', () => {
  let postURL: string | undefined;
  let formData: any;
  let key: string | undefined | null;

  beforeEach(async () => {
    const result = await testUploadLink({}, fakeContext(TEST_USER));
    postURL = result.data?.uploadLink?.postURL;
    formData = result.data?.uploadLink?.formData;
    key = result.data?.uploadLink?.key;
  });

  it.each([
    ['without extensions', '', '47b0b3eb4caad3eda2040a9d314546f1'],
    ['with .jpg extension', '.jpg', '47b0b3eb4caad3eda2040a9d314546f1'],
    ['with .png extension', '.png', '007bf86b9acef7ed24ac2858a182c0e0'],
  ])('should upload new file %s', async (_, extension, etag) => {
    const req = superagent.post(postURL!);
    const data = {
      ...formData,
      key: `${key}${extension}`,
      'Content-Type': 'image/*',
    };

    Object.entries(data).forEach(([k, v]) => {
      req.field(k, v as any);
    });
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

    const filename = key!.replace(`${TEMP}/`, '');
    await expect(
      fileExistsInBucket(TEMP, `${filename}${extension}`, etag),
    ).resolves.toBe(true);
  });

  it('should not upload when key does not starts with given prefix', async () => {
    const jpgReq = superagent.post(postURL!);
    const jpgData = { ...formData, key: 'upload_me.jpg' };
    Object.entries(jpgData).forEach(([k, v]) => {
      jpgReq.field(k, v as any);
    });
    jpgReq.attach(
      'file',
      `${__dirname}/__tests__/upload_me.jpg`,
      'upload_me.jpg',
    );
    await expect(jpgReq).rejects.toThrow('Forbidden');
  });
});
