import { createHmac } from 'crypto';
import { ThumbGravity, ThumbOptions, ThumbResize } from '../ww-commons';
import { MINIO_URL } from './buckets';

const urlSafeBase64 = (url: string | Buffer): string =>
  new Buffer(url as any)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

const hexDecode = (hex: string) => Buffer.from(hex, 'hex');

const imgproxySign = (urlPart: string) => {
  const hmac = createHmac('sha256', hexDecode(process.env.IMGPROXY_KEY!));
  hmac.update(hexDecode(process.env.IMGPROXY_SALT!));
  hmac.update(urlPart);
  return urlSafeBase64(hmac.digest());
};

export const getThumb = (url?: string, options?: ThumbOptions): string | null => {
  if (!url) {
    return null;
  }
  const { width = 128, height = 128, resize = ThumbResize.FILL, gravity = ThumbGravity.CENTER } = options || {};
  const internalURL = url.replace(
    MINIO_URL,
    `http://${process.env.MINIO_HOST}:9000`,
  );
  const encodedUrl = urlSafeBase64(internalURL);
  const path = `/${resize}/${width}/${height}/${gravity}/1/${encodedUrl}.jpg`;
  const signature = imgproxySign(path);

  return `${process.env.PROTOCOL}://${process.env.APP_DOMAIN!}/${process.env.IMGPROXY_PATH}/${signature}${path}`;
};
