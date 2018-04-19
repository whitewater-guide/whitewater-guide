import gql from 'graphql-tag';
import { User, UserInput } from '../../ww-commons';

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
  updateProfile: Partial<User>;
}
