import gql from 'graphql-tag';
import { AppError } from './AppError';

export const APP_ERROR_QUERY = gql`
  {
    appError @client
  }
`;

export interface AppErrorQueryResult {
  appError: AppError | null;
}
