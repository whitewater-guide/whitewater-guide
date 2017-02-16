import React, {Component} from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import theme from "./styles/theme";
import ApolloClient from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import FacebookProvider from './FacebookProvider';
import {meteorClientConfig} from './config/ApolloClientConfig';
import {BrowserRouter} from 'react-router-dom';
import {RootLayout} from "./layouts";

const client = new ApolloClient(meteorClientConfig());

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
