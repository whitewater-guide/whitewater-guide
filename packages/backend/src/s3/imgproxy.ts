import crypto from 'crypto';
import castArray from 'lodash/castArray';

import config from '~/config';
import { S3Prefix } from '~/s3';

import { CONTENT_BUCKET } from './paths';

const urlSafeBase64 = (input: string | Buffer) => {
  const buffer =
    typeof input === 'string' ? Buffer.from(input, 'utf8') : Buffer.from(input);
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
};

const hexDecode = (hex: string) => Buffer.from(hex, 'hex');

const sign = (salt: string, target: string, secret: string) => {
  const hmac = crypto.createHmac('sha256', hexDecode(secret));
  hmac.update(hexDecode(salt));
  hmac.update(target);
  return urlSafeBase64(hmac.digest());
};

type Option =
  | 'resize'
  | 'rs'
  | 'size'
  | 's'
  | 'resizing_type'
  | 'rt'
  | 'width'
  | 'w'
  | 'height'
  | 'h'
  | 'dpr'
  | 'enlarge'
  | 'el'
  | 'extend'
  | 'ex'
  | 'gravity'
  | 'g'
  | 'quality'
  | 'q'
  | 'background'
  | 'bg'
  | 'blur'
  | 'bl'
  | 'sharpe'
  | 'sh'
  | 'watermark'
  | 'wm'
  | 'preset'
  | 'pr'
  | 'cachebuster'
  | 'cb'
  | 'format'
  | 'f'
  | 'ext';
type OptionValue = string | number | Array<string | number>;
type ProcessingOpts = { [key in Option]?: OptionValue | undefined };

export const stringifyProcessingOpts = (opts: ProcessingOpts) => {
  return Object.entries(opts)
    .filter(([k, v]) => v !== undefined)
    .map(([k, v]) => [k, ...castArray(v)].join(':'))
    .join('/');
};

interface Size {
  width?: number;
  height?: number;
}

export const getProcessingOpts = (
  width?: number,
  height?: number,
  steps?: number | number[],
  whitelist?: Size[],
): ProcessingOpts | null => {
  if (!width && !height) {
    return null;
  }
  if (whitelist) {
    for (const size of whitelist) {
      if (size.width === width && size.height === height) {
        return { w: width, h: height };
      }
    }
  }
  if (Array.isArray(steps)) {
    if (!width || steps.length === 0) {
      return null;
    }
    if (steps[0] < steps[steps.length - 1]) {
      throw new Error('steps must be sorted in descending order');
    }
    const widthRounded = steps.reduce(
      (result, v) => (v >= width ? v : result),
      steps[0],
    );
    return { w: widthRounded };
  } else {
    const stepSize = steps || 50;
    const ratio = width && height ? height / width : 1;
    const w = width && Math.ceil(width / stepSize) * stepSize;
    let h = height && Math.ceil(height / stepSize) * stepSize;
    if (w && h) {
      h = Math.ceil(w * ratio);
      return { rs: ['fill', w, h], g: 'sm' };
    }
    return { w, h };
  }
};

/**
 * Get imgproxy URL
 * https://docs.imgproxy.net/#/configuration?id=url-signature
 * https://github.com/DarthSim/imgproxy/blob/master/examples/signature.js
 * @param prefix
 * @param file
 * @param opts
 */
export const getImgproxyURL = (
  prefix: S3Prefix,
  file: string,
  opts: ProcessingOpts | null,
) => {
  const url = `s3://${CONTENT_BUCKET}/${prefix}/${file}`;
  const encodedUrl = urlSafeBase64(url);
  const processingOptions = opts ? stringifyProcessingOpts(opts) : '';
  const path = `/${processingOptions}/${encodedUrl}.jpg`;

  const signature = sign(
    process.env.IMGPROXY_SALT,
    path,
    process.env.IMGPROXY_KEY,
  );
  return `${config.contentPublicURL}/${signature}${path}`;
};

export const Imgproxy = {
  url: getImgproxyURL,
  getProcessingOpts,
};
