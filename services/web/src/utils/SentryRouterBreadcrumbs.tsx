import { Severity } from '@sentry/types';
import React, { useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

const HistoryWatcher = withRouter((props: RouteComponentProps<any>) => {
  useEffect(() => {
    // Adblockers will kill sentry
    if (!!(global as any).Sentry) {
      Sentry.addBreadcrumb({
        category: 'router',
        message: props.location.pathname,
        level: Severity.Info,
      });
    }
  }, [props.location.pathname]);
  return null;
});

export const SentryRouterBreadcrumbs: React.ComponentType = process.env
  .REACT_APP_SENTRY_DSN
  ? HistoryWatcher
  : () => null;

SentryRouterBreadcrumbs.displayName = 'SentryRouterBreadcrumbs';
