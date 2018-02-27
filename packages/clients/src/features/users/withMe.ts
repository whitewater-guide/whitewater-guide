import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { isAdmin, isSuperAdmin, User } from '../../../ww-commons';

const query = gql`
  query me {
    me {
      id
      name
      avatar
      email
      role
    }
  }
`;

export interface WithMe {
  me: User | null;
  meLoading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

/* tslint:disable-next-line:no-inferrable-types */
export const withMe = (cached: boolean = true) => graphql<WithMe>(
  query,
  {
    options: {
      fetchPolicy: cached ? 'cache-first' : 'network-only',
    },
    props: ({ data }) => {
      const { me, loading } = data!;
      return { me, meLoading: loading, isAdmin: isAdmin(me), isSuperAdmin: isSuperAdmin(me) };
    },
  },
);