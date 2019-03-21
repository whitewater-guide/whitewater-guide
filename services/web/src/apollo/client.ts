import {
  configureApolloCache,
  errorLink,
  setApolloErrorClientResolver,
} from '@whitewater-guide/clients';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { createBrowserHistory } from 'history';
import { API_HOST } from '../environment';
import { EditorLanguageLink } from '../i18n/editors';
import { initLocalState } from './initLocalState';
import { refreshJwtLink } from './refreshJwtLink';

const history = createBrowserHistory();

const editorLanguageLink = new EditorLanguageLink();

const httpLink = createHttpLink({
  credentials: 'include',
  uri: `${API_HOST}/graphql`,
});

const cache = configureApolloCache();
initLocalState(cache);

export const client = new ApolloClient({
  link: ApolloLink.from([
    editorLanguageLink,
    errorLink(cache, () => history.replace('/regions')),
    refreshJwtLink,
    httpLink,
  ]),
  cache,
  connectToDevTools: process.env.NODE_ENV === 'development',
  resolvers: {
    Mutation: {
      setApolloError: setApolloErrorClientResolver,
    },
  },
});

client.onClearStore(() => {
  initLocalState(cache);
  return Promise.resolve();
});
client.onResetStore(() => {
  initLocalState(cache);
  return Promise.resolve();
});
