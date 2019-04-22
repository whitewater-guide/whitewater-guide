import { writeInitialAppError } from '@whitewater-guide/clients';
import { ApolloCache } from 'apollo-cache';

export const initLocalState = (cache: ApolloCache<any>) => {
  writeInitialAppError(cache);
};
