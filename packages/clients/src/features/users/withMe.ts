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

interface Result {
  me: User | null;
}

export interface WithMe {
  me: User | null;
  meLoading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

/* tslint:disable-next-line:no-inferrable-types */
export const withMe = (cached: boolean = true) => graphql<{}, Result, {}, WithMe>(
  query,
  {
    alias: 'withMe',
    options: {
      fetchPolicy: cached ? 'cache-first' : 'network-only',
    },
    props: ({ data }) => {
      const { me, loading } = data!;
      return { me: me!, meLoading: loading, isAdmin: isAdmin(me), isSuperAdmin: isSuperAdmin(me) };
    },
  },
);
