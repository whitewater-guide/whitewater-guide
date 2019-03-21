import { writeInitialApolloError } from '@whitewater-guide/clients';
import { ApolloCache } from 'apollo-cache';

export const initLocalState = (cache: ApolloCache<any>) => {
  writeInitialApolloError(cache);
};
