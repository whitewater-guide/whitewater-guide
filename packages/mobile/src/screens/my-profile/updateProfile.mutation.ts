import { User, UserInput } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const UPDATE_MY_PROFILE = gql`
  mutation updateProfile($user: UserInput!) {
    updateProfile(user: $user) {
      id
      language
    }
  }
`;

export interface Vars {
  user: UserInput;
}

export interface Result {
  __typename?: 'Mutation';
  updateProfile: Pick<User, '__typename' | 'id' | 'language'>;
}
