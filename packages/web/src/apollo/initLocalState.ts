import { writeInitialAppError } from '@whitewater-guide/clients';
import { ApolloCache } from 'apollo-cache';

export const initLocalState = (cache: ApolloCache<unknown>) => {
  writeInitialAppError(cache);
};
