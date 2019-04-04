import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from '@whitewater-guide/commons';
import jsonwebtoken from 'jsonwebtoken';

export const getAccessToken = (userId: string) => {
  const payload: AccessTokenPayload = { id: userId };
  return jsonwebtoken.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRES!, 10),
  });
};

export const getRefreshToken = (userId: string) => {
  const payload: RefreshTokenPayload = { id: userId, refresh: true };
  return jsonwebtoken.sign(payload, process.env.REFRESH_TOKEN_SECRET!);
};
