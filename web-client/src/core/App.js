import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { configureApolloClient } from '../commons/apollo';
import theme from "./styles/theme";
import FacebookProvider from './FacebookProvider';
import { RootLayout } from "./layouts";

const client = configureApolloClient();

export default class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={theme}>
        <FacebookProvider appId={process.env.facebook.appId}>
          <ApolloProvider client={client}>
            <BrowserRouter>
              <RootLayout/>
            </BrowserRouter>
          </ApolloProvider>
        </FacebookProvider>
      </MuiThemeProvider>
    );
  }
}
