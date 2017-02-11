import 'react-hot-loader/patch';
import React from 'react';
import {render} from 'react-dom';
import App from './core/App';
import 'react-virtualized/styles.css'; // only needs to be imported once
import './main.css';
import {AppContainer} from 'react-hot-loader';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

render(
  <AppContainer>
    <App/>
  </AppContainer>,
  document.getElementById('render-target')
);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./core/App', () => {
    render(
      <AppContainer>
        <App/>
      </AppContainer>,
      document.getElementById('render-target')
    );
  });
}