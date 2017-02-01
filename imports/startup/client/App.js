import React, {Component} from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import theme from "../../ui/styles/theme";
import Router from "./Router";
import ApolloClient from 'apollo-client';
import { meteorClientConfig } from 'meteor/apollo';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient(meteorClientConfig());

export default class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={theme}>
        <ApolloProvider client={client}>
          <Router/>
        </ApolloProvider>
      </MuiThemeProvider>
    );
  }
}
