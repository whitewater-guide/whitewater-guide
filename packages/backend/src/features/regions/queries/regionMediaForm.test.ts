import superagent from 'superagent';
import { holdTransaction, rollbackTransaction } from '../../../db';
import { fileExistsInBucket, resetTestMinio, TEMP } from '../../../minio';
import { ADMIN, EDITOR_GA_EC, TEST_USER } from '../../../seeds/test/01_users';
import { REGION_ECUADOR } from '../../../seeds/test/04_regions';
import { anonContext, fakeContext } from '../../../test/context';
import { runQuery } from '../../../test/db-helpers';

const query = `
  query regionMediaForm($regionId: ID!) {
    regionMediaForm(regionId: $regionId) {
      upload {
        postURL
        formData
        key
      }
    }
  }
`;

const variables = { regionId: REGION_ECUADOR };

beforeEach(async () => {
  await holdTransaction();
  await resetTestMinio();
});
afterEach(rollbackTransaction);
afterAll(() => resetTestMinio(true));

describe('resolvers chain', () => {
  it('anon should not pass', async () => {
    const result = await runQuery(query, variables, anonContext());
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.regionMediaForm', null);
  });

  it('user should not pass', async () => {
    const result = await runQuery(query, variables, fakeContext(TEST_USER));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.regionMediaForm', null);
  });

  it('editor should not pass', async () => {
    const result = await runQuery(query, variables, fakeContext(EDITOR_GA_EC));
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.regionMediaForm', null);
  });

});

describe('response', () => {

  it('should return correct result', async () => {
    const result = await runQuery(query, variables, fakeContext(ADMIN));
    expect(result.errors).toBeUndefined();
    expect(result.data!.regionMediaForm).toEqual({
      upload: {
        postURL: 'http://localhost:6001/uploads/temp',
        formData: {
          'Content-Type': 'image/*',
          'bucket': 'temp',
          'policy': expect.any(String),
          'x-amz-algorithm': 'AWS4-HMAC-SHA256',
          'x-amz-credential': expect.any(String),
          'x-amz-date': expect.stringMatching(/[0-9TZ]+/),
          'x-amz-signature': expect.any(String),
        },
        key: null,
      },
    });
  });

});

describe('uploads', () => {
  it('should upload new region media', async () => {
    const result = await runQuery(query, variables, fakeContext(ADMIN));
    const { upload: { postURL, formData } } = result.data!.regionMediaForm;

    const jpgReq = superagent.post(postURL);
    const jpgData = { ...formData, key: 'qwerty' };
    Object.entries(jpgData).forEach(([k, v]) => jpgReq.field(k, v as any));
    jpgReq.attach('file', `${__dirname}/__tests__/upload_me.jpg`, 'upload_me.jpg');
    const jpgRes = await jpgReq;

    expect(jpgRes.status).toBe(204);
    // URL is `http://localhost:6001/temp/${key}`
    // and not `http://localhost:6001/uploads/temp/${key}`
    // because minio doesn't know that it's behind proxy
    // see https://github.com/minio/minio/issues/3710
    expect(jpgRes.header.location).toBe(`http://localhost:6001/temp/qwerty`);
    // expect(jpgRes.header.location).toContain(key);
    expect(jpgRes.header.etag).toBe('"a1c4720fa8526d4a8560dd1cb29c0ea7"');

    const exists = await fileExistsInBucket(TEMP, 'qwerty', 'a1c4720fa8526d4a8560dd1cb29c0ea7');
    expect(exists).toBe(true);
  });

});
