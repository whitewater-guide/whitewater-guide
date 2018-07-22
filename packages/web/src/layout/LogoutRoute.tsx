import { ApolloClient } from 'apollo-client';
import React from 'react';
import { withApollo } from 'react-apollo';
import { Redirect } from 'react-router-dom';

interface Props {
  client: ApolloClient<any>;
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

const LogoutRouteWithApollo = withApollo<{}>(LogoutRoute);
export default LogoutRouteWithApollo;
