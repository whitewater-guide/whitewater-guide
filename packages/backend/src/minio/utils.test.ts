import { getTempPostPolicy } from './utils';

describe('getTempPostPolicy', () => {
  it('should return correct postURL and formData', async () => {
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
});

describe('moveTempImage', () => {
  it.skip('should move files between buckets', async () => {

  });
});
