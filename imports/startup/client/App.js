import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import theme from '../../ui/styles/theme';
import Router from './Router';

export default class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={theme}>
        <Router/>
      </MuiThemeProvider>
    );
  }
}
