import * as React from 'react';
import * as ReactDOM from 'react-dom';
// tslint:disable-next-line:no-submodule-imports
import 'react-virtualized/styles.css';
// tslint:disable-next-line:no-import-side-effect
import 'reflect-metadata';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import './styles/react-virtualized-override.css';

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement,
);
registerServiceWorker();
