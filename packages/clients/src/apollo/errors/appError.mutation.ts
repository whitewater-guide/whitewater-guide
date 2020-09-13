import gql from 'graphql-tag';

import { AppError } from './AppError';

export const APP_ERROR_MUTATION = gql`
  mutation setAppError($error: JSON) {
    setAppError(error: $error) @client
  }
`;

export interface AppErrorMutationVars {
  error: AppError | null;
}
