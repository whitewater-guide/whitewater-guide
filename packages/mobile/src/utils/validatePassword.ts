import { PASSWORD_MIN_LENGTH } from '@whitewater-guide/commons';

const _cache: Map<string, number> = new Map();

const validatePassword = (password?: string): number => {
  const pwd = password || '';
  if (_cache.has(pwd)) {
    return _cache.get(pwd)!;
  }
  const zxcvbn = require('zxcvbn');
  let { score } = zxcvbn(pwd);
  if (pwd.length < PASSWORD_MIN_LENGTH) {
    score = 1;
  }
  _cache.set(pwd, score);
  return score;
};

export default validatePassword;
