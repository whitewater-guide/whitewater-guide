import 'react-virtualized/styles.css';
import './i18n';
import './index.css';

import { init } from '@sentry/react';
import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { API_HOST } from './environment';

if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_SENTRY_DSN) {
  init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    release: `v${process.env.REACT_APP_VERSION}`,
    environment: API_HOST.includes('local')
      ? 'local'
      : API_HOST.includes('beta')
      ? 'staging'
      : 'production',
    integrations: (integrations) =>
      // integrations will be all default integrations
      integrations.filter((integration) => integration.name !== 'Breadcrumbs'),
  });
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
