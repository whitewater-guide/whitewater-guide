import { setContext } from '@apollo/client/link/context';

import { tokenStorage } from '../../auth';

export const ACCESS_TOKEN_CTX_KEY = 'accessToken';

export const getAccessTokenContext = (accessToken: string) => ({
  headers: {
    authorization: `Bearer ${accessToken}`,
  },
  [ACCESS_TOKEN_CTX_KEY]: accessToken,
});

// eslint-disable-next-line consistent-return
export const accessTokenLink = setContext(async () => {
  const accessToken = await tokenStorage.getAccessToken();

  if (accessToken) {
    return getAccessTokenContext(accessToken);
  }
});
