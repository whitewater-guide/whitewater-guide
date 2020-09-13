import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from '@whitewater-guide/commons';
import { sign } from 'jsonwebtoken';

export const getAccessToken = (userId: string) => {
  const payload: AccessTokenPayload = { id: userId };
  return sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRES!, 10),
  });
};

export const getRefreshToken = (userId: string) => {
  const payload: RefreshTokenPayload = { id: userId, refresh: true };
  return sign(payload, process.env.REFRESH_TOKEN_SECRET!);
};
