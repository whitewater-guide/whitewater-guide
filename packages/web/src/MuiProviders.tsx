import DateFnsUtils from '@date-io/date-fns';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { SnackbarProvider } from 'notistack';
import React, { FC, PropsWithChildren } from 'react';

import { theme } from './styles';

const MuiProviders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <CssBaseline />
      <MuiThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <SnackbarProvider>{children}</SnackbarProvider>
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    </>
  );
};

export default MuiProviders;
