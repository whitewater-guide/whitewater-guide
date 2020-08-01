import { init } from '@sentry/react';
import React from 'react';
import ReactDOM from 'react-dom';
// tslint:disable-next-line:no-submodule-imports
import 'react-virtualized/styles.css';
import App from './App';
import { API_HOST } from './environment';
import './i18n';
import './index.css';

if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_SENTRY_DSN) {
  init({
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
