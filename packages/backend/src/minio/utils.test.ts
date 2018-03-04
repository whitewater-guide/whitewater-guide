import { AVATARS } from './buckets';
import { BUCKETS_DIR, fileExistsInBucket, FIXTURES_BUCKETS_DIR, resetTestMinio } from './test-utils';
import { getTempPostPolicy, moveTempImage } from './utils';

describe('getTempPostPolicy', () => {
  it('should return correct postURL and formData without key', async () => {
    const result = await getTempPostPolicy();
    expect(result).toEqual({
      formData: {
        'Content-Type': 'image/*',
        'bucket': 'temp',
        'policy': expect.any(String),
        'x-amz-algorithm': 'AWS4-HMAC-SHA256',
        'x-amz-credential': expect.any(String),
        'x-amz-date': expect.stringMatching(/[0-9TZ]+/),
        'x-amz-signature': expect.any(String),
      },
      postURL: 'http://localhost:6001/temp',
    });
  });

  it('should return correct postURL and formData with key', async () => {
    const result = await getTempPostPolicy('myfile333.jpg');
    expect(result).toEqual({
      formData: {
        'Content-Type': 'image/*',
        'bucket': 'temp',
        'key': 'myfile333.jpg',
        'policy': expect.any(String),
        'x-amz-algorithm': 'AWS4-HMAC-SHA256',
        'x-amz-credential': expect.any(String),
        'x-amz-date': expect.stringMatching(/[0-9TZ]+/),
        'x-amz-signature': expect.any(String),
      },
      postURL: 'http://localhost:6001/temp',
    });
  })
});

describe('moveTempImage', () => {
  beforeEach(async () => resetTestMinio());

  afterAll(async () => resetTestMinio(true));

  it('should return url in new bucket', async () => {
    const result = await moveTempImage('http://localhost:6001/uploads/temp/temp1.jpg', AVATARS);
    expect(result).toBe('http://localhost:6001/uploads/avatars/temp1.jpg');
  });

  it('should delete temp file', async () => {
    await moveTempImage('http://localhost:6001/uploads/temp/temp1.jpg', AVATARS);
    const exists = await fileExistsInBucket('temp', 'temp1.jpg');
    expect(exists).toBe(false);
  });

  it('should delete temp file', async () => {
    await moveTempImage('http://localhost:6001/uploads/temp/temp1.jpg', AVATARS);
    const exists = await fileExistsInBucket('avatars', 'temp1.jpg');
    expect(exists).toBe(true);
  });
});
