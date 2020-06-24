import { holdTransaction, rollbackTransaction } from '~/db';
import { fileExistsInBucket, resetTestMinio, TEMP } from '~/minio';
import { TEST_USER, TEST_USER_ID } from '~/seeds/test/01_users';
import { fakeContext, runQuery } from '~/test';
import superagent from 'superagent';

const { PROTOCOL, MINIO_DOMAIN } = process.env;

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
    const result = await runQuery(query, variables, fakeContext(TEST_USER));
    expect(result.errors).toBeUndefined();
    expect(result.data!.uploadLink).toEqual({
      postURL: `${PROTOCOL}://${MINIO_DOMAIN}/${TEMP}`,
      formData: {
        'Content-Type': 'image/*',
        bucket: TEMP,
        key: expect.any(String),
        policy: expect.any(String),
        'x-amz-algorithm': 'AWS4-HMAC-SHA256',
        'x-amz-credential': expect.any(String),
        'x-amz-date': expect.stringMatching(/[0-9TZ]+/),
        'x-amz-signature': expect.any(String),
        'x-amz-meta-uploaded-by': TEST_USER_ID,
      },
      key: expect.any(String),
    });
    expect(result.data!.uploadLink.formData.key).toBe(
      result.data!.uploadLink.key,
    );
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
    const data = { ...formData, key: `${key}${extension}` };

    Object.entries(data).forEach(([k, v]) => req.field(k, v as any));
    req.attach(
      'file',
      `${__dirname}/__tests__/upload_me${extension}`,
      `upload_me${extension}`,
    );
    await expect(req).resolves.toMatchObject({
      status: 204,
      header: {
        location: `${PROTOCOL}://${MINIO_DOMAIN}/${TEMP}/${key}${extension}`,
        etag: expect.any(String),
      },
    });

    await expect(
      fileExistsInBucket(TEMP, `${key}${extension}`, etag),
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
