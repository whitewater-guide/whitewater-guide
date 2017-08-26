import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'react-virtualized/styles.css';
import './styles/react-virtualized-override.css';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement,
);
registerServiceWorker();
