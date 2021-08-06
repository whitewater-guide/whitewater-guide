import { fileExistsInBucket, resetTestMinio } from '@test';

import { S3Client } from './client';
import { AVATARS, CONTENT_BUCKET, TEMP } from './paths';

jest.unmock('./imgproxy');

describe('getTempPostPolicy', () => {
  it('should return correct postURL and formData without key', async () => {
    const client = new S3Client();
    const result = await client.getTempPostPolicy();
    expect(result).toEqual({
      formData: {
        bucket: CONTENT_BUCKET,
        Policy: expect.any(String),
        'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
        'X-Amz-Credential': expect.any(String),
        'X-Amz-Date': expect.stringMatching(/[0-9TZ]+/),
        'X-Amz-Signature': expect.any(String),
      },
      postURL: `http://localhost:9000/${CONTENT_BUCKET}`,
    });
  });

  it('should return correct postURL and formData with key', async () => {
    const client = new S3Client();
    const result = await client.getTempPostPolicy('myfile333.jpg');
    expect(result).toEqual({
      formData: {
        bucket: CONTENT_BUCKET,
        Policy: expect.any(String),
        'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
        'X-Amz-Credential': expect.any(String),
        'X-Amz-Date': expect.stringMatching(/[0-9TZ]+/),
        'X-Amz-Signature': expect.any(String),
      },
      postURL: `http://localhost:9000/${CONTENT_BUCKET}`,
    });
  });

  it('should set uploader in metadata', async () => {
    const client = new S3Client();
    const result = await client.getTempPostPolicy('myfile333.jpg', 'uuid');
    expect(result).toEqual({
      formData: {
        bucket: CONTENT_BUCKET,
        Policy: expect.any(String),
        'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
        'X-Amz-Credential': expect.any(String),
        'X-Amz-Date': expect.stringMatching(/[0-9TZ]+/),
        'X-Amz-Signature': expect.any(String),
        'x-amz-meta-uploaded-by': 'uuid',
      },
      postURL: `http://localhost:9000/${CONTENT_BUCKET}`,
    });
  });
});

describe('rename file', () => {
  it('should keep old if new is not provided', () => {
    const client = new S3Client();
    expect(client.renameFile('foobar.png')).toBe('foobar.png');
  });

  it('should keep extension', () => {
    const client = new S3Client();
    expect(client.renameFile('foobar.png', '123-456')).toBe('123-456.png');
  });
});

describe('moveTempImage', () => {
  beforeEach(async () => resetTestMinio());

  afterAll(async () => resetTestMinio(true));

  it('should delete temp file', async () => {
    const client = new S3Client();
    await client.moveTempImage(
      `http://localhost:6001/uploads/${TEMP}/temp1.jpg`,
      AVATARS,
    );
    const exists = await fileExistsInBucket(TEMP, 'temp1.jpg');
    expect(exists).toBe(false);
  });

  it('should create file in other bucket', async () => {
    const client = new S3Client();
    await client.moveTempImage(
      `http://localhost:6001/uploads/${TEMP}/temp1.jpg`,
      AVATARS,
    );
    // Use http://onlinemd5.com/ to generate etags (md5)
    const exists = await fileExistsInBucket(
      AVATARS,
      'temp1.jpg',
      'c8773384029dbf0a11464f6ad3a82997',
    );
    expect(exists).toBe(true);
  });

  it('should overwrite existing file', async () => {
    const client = new S3Client();
    await client.moveTempImage(
      `http://localhost:6001/uploads/${TEMP}/overwrite.png`,
      AVATARS,
    );
    const exists = await fileExistsInBucket(
      AVATARS,
      'overwrite.png',
      '4bfdb23e6fd7255f908d0a0de979bf3d',
    );
    expect(exists).toBe(true);
  });

  it('should rename file', async () => {
    const client = new S3Client();
    await client.moveTempImage(
      `http://localhost:6001/uploads/${TEMP}/overwrite.png`,
      AVATARS,
      'foobar',
    );
    const exists = await fileExistsInBucket(
      AVATARS,
      'foobar.png',
      '4bfdb23e6fd7255f908d0a0de979bf3d',
    );
    expect(exists).toBe(true);
  });
});

describe('getLocalFileName', () => {
  it.each([
    ['null', null],
    ['undefined', undefined],
    ['empty string', ''],
  ])('should handle %s', (_, v) => {
    const client = new S3Client();
    expect(client.getLocalFileName(v)).toBeNull();
  });

  it.each([
    [
      'location tag as returned by uploading to presigned post url',
      'https://s3.amazonaws.com/content.whitewater-dev.com/temp%2F1bd0c8e0-6702-11eb-bb16-af49de2e72bb.jpg',
    ],
    ['simple filename', '1bd0c8e0-6702-11eb-bb16-af49de2e72bb.jpg'],
    [
      's3 key (relative to bucket)',
      'media/1bd0c8e0-6702-11eb-bb16-af49de2e72bb.jpg',
    ],
    [
      'public content url',
      `${process.env.CONTENT_PUBLIC_URL}/Jcaagbygy338IdfbNfTXADI6cEyOm2Kxo-I2eAxtI_k//czM6Ly9jb250ZW50LTEvbWVkaWEvMWJkMGM4ZTAtNjcwMi0xMWViLWJiMTYtYWY0OWRlMmU3MmJiLmpwZw.jpg`,
    ],
  ])('should accept %s', (_, v) => {
    const client = new S3Client();
    expect(client.getLocalFileName(v)).toBe(
      '1bd0c8e0-6702-11eb-bb16-af49de2e72bb.jpg',
    );
  });
});
