import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_SCORE,
} from '@whitewater-guide/commons';
import zxcvbn from 'zxcvbn';

export const isPasswordWeak = (password: string): boolean =>
  password.length < PASSWORD_MIN_LENGTH ||
  zxcvbn(password).score < PASSWORD_MIN_SCORE;
