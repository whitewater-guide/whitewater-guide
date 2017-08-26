import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'react-virtualized/styles.css';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import './styles/react-virtualized-override.css';

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement,
);
registerServiceWorker();
