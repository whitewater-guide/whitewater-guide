import { setContext } from 'apollo-link-context';
import { tokenStorage } from '../../auth';

export const ACCESS_TOKEN_CTX_KEY = 'accessToken';

export const accessTokenLink = setContext(async () => {
  const accessToken = await tokenStorage.getAccessToken();

  if (accessToken) {
    return {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      [ACCESS_TOKEN_CTX_KEY]: accessToken,
    };
  }
});
