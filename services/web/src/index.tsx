import React from 'react';
import ReactDOM from 'react-dom';
// tslint:disable-next-line:no-submodule-imports
import 'react-virtualized/styles.css';
// tslint:disable-next-line:no-import-side-effect
import 'reflect-metadata';
import App from './App';
import './index.css';
import './styles/react-virtualized-override.css';

declare const Raven: any;

if (process.env.REACT_APP_RAVEN) {
  Raven.config(process.env.REACT_APP_RAVEN, {
    release: `v${process.env.REACT_APP_VERSION}`,
  }).install();
}

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);