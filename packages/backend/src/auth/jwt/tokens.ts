import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from '@whitewater-guide/commons';
import { sign } from 'jsonwebtoken';

import config from '~/config';

export const getAccessToken = (userId: string) => {
  const payload: AccessTokenPayload = { id: userId };
  return sign(payload, config.ACCESS_TOKEN_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRES,
  });
};

export const getRefreshToken = (userId: string) => {
  const payload: RefreshTokenPayload = { id: userId, refresh: true };
  return sign(payload, config.REFRESH_TOKEN_SECRET);
};
