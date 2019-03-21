import { withMe } from '@whitewater-guide/clients';
import { User } from '@whitewater-guide/commons';
import { ApolloClient } from 'apollo-client';
import { withApollo } from 'react-apollo';
import { compose, mapProps } from 'recompose';

export interface InnerProps {
  user: User | null;
  client: ApolloClient<any>;
}

export default compose<InnerProps, any>(
  withMe,
  mapProps(({ me, match, location, history, ...rest }: any) => ({
    user: me,
    location,
    ...rest,
  })),
  withApollo,
);
