import { AVATARS, AVATARS_BUCKET_URL } from '../minio';
import { getThumb } from './thumbs';

const decode = (url: string): string => {
  const path64 = url.split('/').pop()!.replace('.jpg', '');
  return new Buffer(path64, 'base64').toString('utf8');
};

it('should handle undefined urls', () => {
  const thumb = getThumb(undefined, { width: 50, height: 50 });
  expect(thumb).toBeNull();
});

it('should replace external url with internal', () => {
  const external = `${AVATARS_BUCKET_URL}/avatar.jpg`;
  const thumb = getThumb(external, { width: 50, height: 50 });
  const path = decode(thumb!);
  expect(path).toBe(
    `http://${process.env.MINIO_HOST}:9000/${process.env.MINIO_PROXY_PATH}/${AVATARS}/avatar.jpg`,
  );
});

it('should not affect third-party urls', () => {
  const thirdParty = 'http://ya.ru/pic.jpg';
  const thumb = getThumb(thirdParty, { width: 50, height: 50 });
  const path = decode(thumb!);
  expect(path).toBe(thirdParty);
});

it('result should contain dimensions', () => {
  const thirdParty = 'http://ya.ru/pic.jpg';
  const thumb = getThumb(thirdParty, { width: 51, height: 62 });
  expect(thumb).toEqual(expect.stringContaining('51/62'));
});
