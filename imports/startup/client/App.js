import React, {Component} from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import theme from "../../ui/styles/theme";
import Router from "./Router";
import ApolloClient from 'apollo-client';
import {meteorClientConfig} from 'meteor/apollo';
import {ApolloProvider} from 'react-apollo';
import FacebookProvider from './core/FacebookProvider';
import {Meteor} from 'meteor/meteor';

const client = new ApolloClient(meteorClientConfig());

export default class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={theme}>
        <FacebookProvider appId={Meteor.settings.public.oAuth.facebook.appId}>
          <ApolloProvider client={client}>
            <Router/>
          </ApolloProvider>
        </FacebookProvider>
      </MuiThemeProvider>
    );
  }
}
