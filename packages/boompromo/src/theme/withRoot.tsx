import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import React, { ReactType } from 'react';

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#55a7e5',
      main: '#0078b3',
      dark: '#004d83',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ffca47',
      main: '#ff9900',
      dark: '#c66a00',
      contrastText: '#000',
    },
  },
});

export function withRoot(Component: React.ReactType) {
  function WithRoot(props: object) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <MuiThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...props} />
      </MuiThemeProvider>
    );
  }

  return WithRoot;
}
