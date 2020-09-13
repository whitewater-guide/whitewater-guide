import React from 'react';
import { addDecorator, configure } from '@storybook/react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { theme } from '../src/styles';

addDecorator((story) => (
  <MuiThemeProvider theme={theme}>{story()}</MuiThemeProvider>
));

const req = require.context('../src', true, /.stories.tsx/);
function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
