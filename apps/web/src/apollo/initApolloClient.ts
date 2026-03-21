import type { ApolloError } from '@apollo/client';
import { ApolloClient } from '@apollo/client';
import { ApolloLink } from '@apollo/client/link/core';
import { createHttpLink } from '@apollo/client/link/http';
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';
import type { AuthService } from '@whitewater-guide/clients';
import { configureApolloCache, errorLink } from '@whitewater-guide/clients';
import { RefreshJwtLink } from '@whitewater-guide/clients/dist/web';

import { API_HOST } from '../environment';
import { EditorLanguageLink } from '../i18n/editors';

export default function initApolloClient(
  auth: AuthService,
  onApolloError?: (error: ApolloError) => void,
): ApolloClient<unknown> {
  const editorLanguageLink = new EditorLanguageLink();

  const httpLink = createHttpLink({
    credentials: 'include',
    uri: `${API_HOST}/graphql`,
    headers: {
      'Cache-Control': 'no-store',
      'X-Client': `whitwater.guide/web/${process.env.REACT_APP_VERSION}`,
    },
  });

  const cache = configureApolloCache();

  const refreshJwtLink = new RefreshJwtLink(auth);

  const client = new ApolloClient({
    link: ApolloLink.from([
      editorLanguageLink,
      errorLink(() => {
        auth.signOut(true);
      }, onApolloError),
      removeTypenameFromVariables(),
      refreshJwtLink,
      httpLink,
    ]),
    cache,
    connectToDevTools: process.env.NODE_ENV === 'development',
  });

  return client;
}
