import { gql, graphql } from 'react-apollo';
import { User } from '../../../ww-commons';

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
}

/* tslint:disable-next-line:no-inferrable-types */
export const withMe = (cached: boolean = true) => graphql<WithMe>(
  query,
  {
    options: {
      fetchPolicy: cached ? 'cache-only' : 'network-only',
    },
    props: ({ data }) => {
      const { me, loading } = data!;
      return { me, meLoading: loading };
    },
  },
);
