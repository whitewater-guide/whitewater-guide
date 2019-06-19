import React from 'react';
import { hydrate, render } from 'react-dom';
import './i18n';
import JssRoot from './JssRoot';

const rootElement = document.getElementById('root');
if (rootElement && rootElement.hasChildNodes()) {
  hydrate(<JssRoot />, rootElement);
} else {
  render(<JssRoot />, rootElement);
}
