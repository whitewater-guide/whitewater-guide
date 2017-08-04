import * as React from 'react';
import * as ReactDOM from 'react-dom';

import injectTapEventPlugin from 'react-tap-event-plugin';

import 'react-virtualized/styles.css'; // only needs to be imported once
import App from './core/App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

injectTapEventPlugin();

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
