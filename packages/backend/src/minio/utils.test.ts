import { MINIO_URL } from './buckets';
import { getKeyFromImage } from './utils';

describe('getKeyFromImage', () => {
  it('key should contain slash', () => {
    const url = `${MINIO_URL}/temp/aaa.jpg`;
    expect(getKeyFromImage(url, 'temp')).toBe('temp/aaa.jpg');
  });
});
