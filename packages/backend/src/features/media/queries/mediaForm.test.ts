import superagent from 'superagent';
import { MutationNotAllowedError } from '../../../apollo';
import { holdTransaction, rollbackTransaction } from '../../../db';
import { fileExistsInBucket, resetTestMinio, TEMP } from '../../../minio';
import { PHOTO_1 } from '../../../seeds/test/10_media';
import { adminContext, anonContext, userContext } from '../../../test/context';
import { runQuery } from '../../../test/db-helpers';
import { UUID_REGEX } from '../../../test/isUUID';

const query = `
  query mediaForm($id: ID) {
    mediaForm(id: $id) {
      id
      upload {
        postURL
        formData
        key
      }
    }
  }
`;

beforeEach(async () => {
  await holdTransaction();
  await resetTestMinio();
});
afterEach(rollbackTransaction);
afterAll(() => resetTestMinio(true));

describe('resolvers chain', () => {
  test('anon should not pass', async () => {
    const result = await runQuery(query, {}, anonContext);
    expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
    expect(result).toHaveProperty('data.mediaForm', null);
  });

  test('user should not pass', async () => {
    const result = await runQuery(query, {}, userContext);
    expect(result).toHaveProperty('errors.0.name', 'ForbiddenError');
    expect(result).toHaveProperty('data.mediaForm', null);
  });
});

describe('response', () => {
  it('should fail for non-existing media id', async () => {
    const result = await runQuery(query, { id: 'fb2d84e0-1f95-11e8-b467-0ed5f89f718b' }, adminContext);
    expect(result).toHaveProperty('errors.0.name', 'MutationNotAllowedError');
    expect(result).toHaveProperty('errors.0.message', 'This media does not exist');
    expect(result).toHaveProperty('data.mediaForm', null);
  });

  it('should return correct result for existing media', async () => {
    const result = await runQuery(query, { id: PHOTO_1 }, adminContext);
    expect(result.errors).toBeUndefined();
    expect(result.data!.mediaForm).toEqual({
      id: PHOTO_1,
      upload: {
        postURL: 'http://localhost:6001/uploads/temp',
        formData: {
          'Content-Type': 'image/*',
          'bucket': 'temp',
          'key': PHOTO_1,
          'policy': expect.any(String),
          'x-amz-algorithm': 'AWS4-HMAC-SHA256',
          'x-amz-credential': expect.any(String),
          'x-amz-date': expect.stringMatching(/[0-9TZ]+/),
          'x-amz-signature': expect.any(String),
        },
        key: PHOTO_1,
      },
    });
  });

  it('should return correct result for new media', async () => {
    const result = await runQuery(query, {}, adminContext);
    expect(result.errors).toBeUndefined();
    expect(result.data!.mediaForm).toEqual({
      id: expect.stringMatching(UUID_REGEX),
      upload: {
        postURL: 'http://localhost:6001/uploads/temp',
        formData: {
          'Content-Type': 'image/*',
          'bucket': 'temp',
          'key': expect.stringMatching(UUID_REGEX),
          'policy': expect.any(String),
          'x-amz-algorithm': 'AWS4-HMAC-SHA256',
          'x-amz-credential': expect.any(String),
          'x-amz-date': expect.stringMatching(/[0-9TZ]+/),
          'x-amz-signature': expect.any(String),
        },
        key: expect.stringMatching(UUID_REGEX),
      },
    });
    expect(result.data!.mediaForm.id).toBe(result.data!.mediaForm.upload.key);
    expect(result.data!.mediaForm.id).toBe(result.data!.mediaForm.upload.formData.key);
  });

});

describe('uploads', () => {
  it('should upload new media', async () => {
    const result = await runQuery(query, {}, adminContext);
    const { upload: { postURL, formData, key }, id } = result.data!.mediaForm;

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

    const exists = await fileExistsInBucket(TEMP, id, 'a1c4720fa8526d4a8560dd1cb29c0ea7');
    expect(exists).toBe(true);
  });

  it('should overwrite existing media', async () => {
    const result = await runQuery(query, { id: PHOTO_1 }, adminContext);
    const { upload: { postURL, formData, key }, id } = result.data!.mediaForm;

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

    const exists = await fileExistsInBucket(TEMP, PHOTO_1, 'a1c4720fa8526d4a8560dd1cb29c0ea7');
    expect(exists).toBe(true);
  });
});
