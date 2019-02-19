import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';
import { create } from 'jss';
import React from 'react';
import { JssProvider } from 'react-jss';
import App from './App';

const generateClassName = createGenerateClassName();
const jss = create(jssPreset());
// We define a custom insertion point that JSS will look for injecting the styles in the DOM.
// @ts-ignore
jss.options.insertionPoint = document.getElementById('jss-insertion-point');

const JssRoot: React.SFC = () => (
  <JssProvider jss={jss} generateClassName={generateClassName}>
    <App />
  </JssProvider>
);

export default JssRoot;
