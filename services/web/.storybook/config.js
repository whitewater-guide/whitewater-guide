import React from 'react';
import { addDecorator, configure } from '@storybook/react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { theme } from '../src/styles';

addDecorator((story) => (
  <MuiThemeProvider muiTheme={theme}>{story()}</MuiThemeProvider>
));

const req = require.context('../src', true, /.stories.tsx/);
function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
