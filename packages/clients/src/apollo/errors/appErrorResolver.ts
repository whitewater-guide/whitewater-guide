import { ApolloCache } from 'apollo-cache';
import { LocalResolver } from '../types';
import { AppError } from './AppError';
import { APP_ERROR_QUERY, AppErrorQueryResult } from './appError.query';

interface Vars {
  error: AppError;
}

const setAppError: LocalResolver<Vars> = (_, { error }, { cache }) => {
  cache.writeQuery<AppErrorQueryResult>({
    query: APP_ERROR_QUERY,
    data: { appError: error },
  });
  return null;
};

export const writeInitialAppError = (cache: ApolloCache<any>) => {
  cache.writeData<AppErrorQueryResult>({ data: { appError: null } });
};

export const appErrorResolver = {
  setAppError,
};
