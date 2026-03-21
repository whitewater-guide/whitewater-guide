import { randomInt } from 'crypto';

const CHARS =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&+-=_@';
const NUM_CHARS = CHARS.length;

export function randomString(length: number): string {
  let result = '';
  let l = length;

  while (l--) {
    result += CHARS[randomInt(NUM_CHARS)];
  }

  return result;
}
