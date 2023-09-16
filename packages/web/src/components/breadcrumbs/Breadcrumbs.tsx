import MUIBreadcrumbs from '@material-ui/core/Breadcrumbs';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useLocation } from 'react-router';

import Breadcrumb from './Breadcrumb';
import getPathTokens from './getPathTokens';
import getRouteMatch from './getRouteMatch';
import type { BreadcrumbMatch, BreadcrumbsProps } from './types';

const useStyles = makeStyles((theme) =>
  createStyles({
    breadcrumbs: {
      color: theme.palette.primary.contrastText,
    },
  }),
);

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ routes }) => {
  const classes = useStyles();
  const location = useLocation();
  const breadcrumbs: BreadcrumbMatch[] = getPathTokens(location.pathname)
    .map((token) => getRouteMatch(routes, token))
    .filter((b): b is BreadcrumbMatch => !!b);
  return (
    <MUIBreadcrumbs
      aria-label="Breadcrumb"
      classes={{ root: classes.breadcrumbs }}
    >
      {breadcrumbs.map((breadcrumb: BreadcrumbMatch, i) => {
        const isLast = i === breadcrumbs.length - 1;
        return (
          <Breadcrumb
            key={breadcrumb.path}
            path={breadcrumb.path}
            isLast={isLast}
            value={breadcrumb.value}
            param={breadcrumb.param}
          />
        );
      })}
    </MUIBreadcrumbs>
  );
};
