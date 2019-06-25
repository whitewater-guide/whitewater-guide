import React from 'react';
import ReactDOM from 'react-dom';
// tslint:disable-next-line:no-submodule-imports
import 'react-virtualized/styles.css';
// tslint:disable-next-line:no-import-side-effect
import 'reflect-metadata';
import App from './App';
import { API_HOST } from './environment';
import './index.css';
import './styles/react-virtualized-override.css';

if (process.env.REACT_APP_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    release: `v${process.env.REACT_APP_VERSION}`,
    environment: API_HOST.includes('local')
      ? 'local'
      : API_HOST.includes('beta')
      ? 'staging'
      : 'production',
    integrations: (integrations) => {
      // integrations will be all default integrations
      return integrations.filter(
        (integration) => integration.name !== 'Breadcrumbs',
      );
    },
  });
}

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
