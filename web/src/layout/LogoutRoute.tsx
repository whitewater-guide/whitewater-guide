import { ApolloClient } from 'apollo-client';
import * as React from 'react';
import { withApollo } from 'react-apollo';
import { Redirect, Route } from 'react-router-dom';

interface Props {
  client: ApolloClient;
}

class LogoutRoute extends React.PureComponent<Props> {
  componentWillMount() {
    this.props.client.resetStore();
  }

  render() {
    return (
      <Redirect to="/" />
    );
  }
}

export default withApollo(LogoutRoute);
