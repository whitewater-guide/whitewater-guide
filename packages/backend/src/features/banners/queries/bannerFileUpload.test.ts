import { holdTransaction, rollbackTransaction } from '@db';
import { fileExistsInBucket, resetTestMinio, TEMP } from '@minio';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '@seeds/01_users';
import { anonContext, fakeContext, runQuery } from '@test';
import { ApolloErrorCodes } from '@ww-commons';
import superagent from 'superagent';

const query = `
  query bannerFileUpload {
    bannerFileUpload {
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

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await runQuery(query, variables, anonContext());
    expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
  });

  it('user should not pass', async () => {
    const result = await runQuery(query, variables, fakeContext(TEST_USER));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

  it('editor should not pass', async () => {
    const result = await runQuery(query, variables, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveGraphqlError(ApolloErrorCodes.FORBIDDEN);
  });

});

describe('response', () => {

  it('should return correct result', async () => {
    const result = await runQuery(query, variables, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.bannerFileUpload).toEqual({
      postURL: 'http://localhost:6001/uploads/temp',
      formData: {
        'Content-Type': 'image/*',
        'bucket': 'temp',
        'key': expect.any(String),
        'policy': expect.any(String),
        'x-amz-algorithm': 'AWS4-HMAC-SHA256',
        'x-amz-credential': expect.any(String),
        'x-amz-date': expect.stringMatching(/[0-9TZ]+/),
        'x-amz-signature': expect.any(String),
      },
      key: expect.any(String),
    });
    expect(result.data!.bannerFileUpload.formData.key).toBe(result.data!.bannerFileUpload.key);
  });

});

describe('uploads', () => {
  it('should upload new banner file', async () => {
    const result = await runQuery(query, variables, fakeContext(ADMIN));
    const { postURL, formData, key } = result.data!.bannerFileUpload;

    const jpgReq = superagent.post(postURL);
    const jpgData = { ...formData, key };
    Object.entries(jpgData).forEach(([k, v]) => jpgReq.field(k, v as any));
    jpgReq.attach('file', `${__dirname}/__tests__/upload_me.jpg`, 'upload_me.jpg');
    const jpgRes = await jpgReq;

    expect(jpgRes.status).toBe(204);
    // URL is `http://localhost:6001/temp/${key}`
    // and not `http://localhost:6001/uploads/temp/${key}`
    // because minio doesn't know that it's behind proxy
    // see https://github.com/minio/minio/issues/3710
    expect(jpgRes.header.location).toBe(`http://localhost:6001/temp/${key}`);
    // expect(jpgRes.header.location).toContain(key);
    expect(jpgRes.header.etag).toBe('"a1c4720fa8526d4a8560dd1cb29c0ea7"');

    const exists = await fileExistsInBucket(TEMP, key, 'a1c4720fa8526d4a8560dd1cb29c0ea7');
    expect(exists).toBe(true);
  });

});
