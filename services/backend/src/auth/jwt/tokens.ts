import jsonwebtoken from 'jsonwebtoken';
import { AccessTokenPayload, RefreshTokenPayload } from './types';

export const getAccessToken = (userId: string) => {
  const payload: AccessTokenPayload = { id: userId };
  return jsonwebtoken.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
  });
};

export const getRefreshToken = (userId: string) => {
  const payload: RefreshTokenPayload = { id: userId, refresh: true };
  return jsonwebtoken.sign(payload, process.env.REFRESH_TOKEN_SECRET!);
};
