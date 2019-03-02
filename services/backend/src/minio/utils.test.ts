import { AVATARS } from './buckets';
import { fileExistsInBucket, resetTestMinio } from './test-utils';
import { getTempPostPolicy, moveTempImage } from './utils';

describe('getTempPostPolicy', () => {
  it('should return correct postURL and formData without key', async () => {
    const result = await getTempPostPolicy();
    expect(result).toEqual({
      formData: {
        'Content-Type': 'image/*',
        bucket: 'temp',
        policy: expect.any(String),
        'x-amz-algorithm': 'AWS4-HMAC-SHA256',
        'x-amz-credential': expect.any(String),
        'x-amz-date': expect.stringMatching(/[0-9TZ]+/),
        'x-amz-signature': expect.any(String),
      },
      postURL: 'http://localhost:6002/temp',
    });
  });

  it('should return correct postURL and formData with key', async () => {
    const result = await getTempPostPolicy('myfile333.jpg');
    expect(result).toEqual({
      formData: {
        'Content-Type': 'image/*',
        bucket: 'temp',
        key: 'myfile333.jpg',
        policy: expect.any(String),
        'x-amz-algorithm': 'AWS4-HMAC-SHA256',
        'x-amz-credential': expect.any(String),
        'x-amz-date': expect.stringMatching(/[0-9TZ]+/),
        'x-amz-signature': expect.any(String),
      },
      postURL: 'http://localhost:6002/temp',
    });
  });
});

describe('moveTempImage', () => {
  beforeEach(async () => resetTestMinio());

  afterAll(async () => resetTestMinio(true));

  it('should delete temp file', async () => {
    await moveTempImage(
      'http://localhost:6001/uploads/temp/temp1.jpg',
      AVATARS,
    );
    const exists = await fileExistsInBucket('temp', 'temp1.jpg');
    expect(exists).toBe(false);
  });

  it('should create file in other bucket', async () => {
    await moveTempImage(
      'http://localhost:6001/uploads/temp/temp1.jpg',
      AVATARS,
    );
    // Use http://onlinemd5.com/ to generate etags (md5)
    const exists = await fileExistsInBucket(
      'avatars',
      'temp1.jpg',
      'c8773384029dbf0a11464f6ad3a82997',
    );
    expect(exists).toBe(true);
  });

  it('should overwrite existing file', async () => {
    await moveTempImage(
      'http://localhost:6001/uploads/temp/overwrite.png',
      AVATARS,
    );
    const exists = await fileExistsInBucket(
      'avatars',
      'overwrite.png',
      '4bfdb23e6fd7255f908d0a0de979bf3d',
    );
    expect(exists).toBe(true);
  });
});
