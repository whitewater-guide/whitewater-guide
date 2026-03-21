import crypto from 'crypto';
import { castArray } from 'lodash';

import config from '../config';
import type { S3Prefix } from '../s3/index';
import { CONTENT_BUCKET } from './paths';

const urlSafeBase64Encode = (input: string | Buffer) => {
  const buffer =
    typeof input === 'string' ? Buffer.from(input, 'utf8') : Buffer.from(input);
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
};

const urlSafeBase64Decode = (input: string): string => {
  const n = input.length % 4;
  const padded = input + '='.repeat(n > 0 ? 4 - n : n);
  const base64String = padded.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(base64String, 'base64').toString('utf8');
};

const hexDecode = (hex: string) => Buffer.from(hex, 'hex');

const sign = (salt: string, target: string, secret: string) => {
  const hmac = crypto.createHmac('sha256', hexDecode(secret));
  hmac.update(hexDecode(salt));
  hmac.update(target);
  return urlSafeBase64Encode(hmac.digest());
};

const verify = (
  value: string,
  signature: string,
  salt: string,
  secret: string,
) => signature === sign(salt, value, secret);

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

export const stringifyProcessingOpts = (opts: ProcessingOpts) =>
  Object.entries(opts)
    .filter(([_, v]) => v !== undefined)
    .map(([k, v]) => [k, ...castArray(v)].join(':'))
    .join('/');

interface Size {
  width?: number;
  height?: number;
}

export const getProcessingOpts = (
  width?: number | null,
  height?: number | null,
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
  }
  const stepSize = steps || 50;
  const ratio = width && height ? height / width : 1;
  const w = width ? Math.ceil(width / stepSize) * stepSize : undefined;
  let h = height ? Math.ceil(height / stepSize) * stepSize : undefined;
  if (w && h) {
    h = Math.ceil(w * ratio);
    return { rs: ['fill', w, h], g: 'sm' };
  }
  return { w, h };
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
  const encodedUrl = urlSafeBase64Encode(url);
  const processingOptions = opts ? stringifyProcessingOpts(opts) : '';
  const path = `/${processingOptions}/${encodedUrl}.jpg`;

  const signature = sign(config.IMGPROXY_SALT, path, config.IMGPROXY_KEY);
  return `${config.contentPublicURL}/${signature}${path}`;
};

/**
 * Returns filename from public-facing content URL
 * Verifies imgproxy signature
 * @param url e.g. https://content.whitewater.guide/<IMGPROXY mumbo-jumbo>
 */
export const decodeContentURL = (url: string): string => {
  if (!url.startsWith(config.contentPublicURL)) {
    throw new Error('Invalid content URL');
  }
  const [_publicURL, signature, processingOpts, encodedFilename] = url
    .replace(config.contentPublicURL, '')
    .split('/');
  if (
    !verify(
      `/${processingOpts}/${encodedFilename}`,
      signature,
      config.IMGPROXY_SALT,
      config.IMGPROXY_KEY,
    )
  ) {
    throw new Error('Invalid content URL signature');
  }
  const base64Filename = encodedFilename.split('.').shift();
  if (!base64Filename) {
    throw new Error('Content URL must end with extension');
  }
  const s3URL = urlSafeBase64Decode(base64Filename);

  if (
    // It's hard to provide test URL with same JEST_WORKER_ID
    // eslint-disable-next-line node/no-process-env
    process.env.NODE_ENV !== 'test' &&
    !s3URL.startsWith(`s3://${CONTENT_BUCKET}`)
  ) {
    throw new Error('Content URL must point to S3');
  }
  const result = s3URL.split('/').pop();
  if (!result) {
    throw new Error('Content points to empty filename');
  }
  return result;
};

export const Imgproxy = {
  url: getImgproxyURL,
  getProcessingOpts,
  decodeContentURL,
};
