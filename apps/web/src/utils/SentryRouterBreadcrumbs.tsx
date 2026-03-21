import { addBreadcrumb } from '@sentry/react';
import type React from 'react';
import { useEffect } from 'react';
import type { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router';

const HistoryWatcher = withRouter((props: RouteComponentProps) => {
  useEffect(() => {
    // Adblockers will kill sentry
    // if (!!(global as any).Sentry) {
    addBreadcrumb({
      category: 'router',
      message: props.location.pathname,
      level: 'info',
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
