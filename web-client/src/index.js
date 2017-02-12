import React from 'react';
import {render} from 'react-dom';
import App from './core/App';
import 'react-virtualized/styles.css'; // only needs to be imported once
import './main.css';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

render(
  <App/>,
  document.getElementById('render-target')
);