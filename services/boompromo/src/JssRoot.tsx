import { jssPreset, StylesProvider } from '@material-ui/styles';
import { create } from 'jss';
import React from 'react';
import App from './App';

const jss = create({
  ...jssPreset(),
  // Define a custom insertion point that JSS will look for when injecting the styles into the DOM.
  insertionPoint: document.getElementById('jss-insertion-point')!,
});

const JssRoot: React.SFC = () => (
  <StylesProvider jss={jss}>
    <App />
  </StylesProvider>
);

export default JssRoot;
