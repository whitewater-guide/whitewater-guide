import { addBreadcrumb, Severity } from '@sentry/react';
import React, { useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

const HistoryWatcher = withRouter((props: RouteComponentProps) => {
  useEffect(() => {
    // Adblockers will kill sentry
    // if (!!(global as any).Sentry) {
    addBreadcrumb({
      category: 'router',
      message: props.location.pathname,
      level: Severity.Info,
    });
    // }
  }, [props.location.pathname]);
  return null;
});

export const SentryRouterBreadcrumbs: React.ComponentType = process.env
  .REACT_APP_SENTRY_DSN
  ? HistoryWatcher
  : () => null;

SentryRouterBreadcrumbs.displayName = 'SentryRouterBreadcrumbs';
