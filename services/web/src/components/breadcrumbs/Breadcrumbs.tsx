import MUIBreadcrumbs from '@material-ui/core/Breadcrumbs';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';
import useRouter from 'use-react-router';
import Breadcrumb from './Breadcrumb';
import getPathTokens from './getPathTokens';
import getRouteMatch from './getRouteMatch';
import { BreadcrumbMatch, BreadcrumbsProps } from './types';

const useStyles = makeStyles((theme) =>
  createStyles({
    breadcrumbs: {
      color: theme.palette.primary.contrastText,
    },
  }),
);

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ routes }) => {
  const classes = useStyles();
  const { location } = useRouter();
  const breadcrumbs: BreadcrumbMatch[] = getPathTokens(location.pathname)
    .map((token) => getRouteMatch(routes, token))
    .filter((b) => !!b) as any;
  return (
    <MUIBreadcrumbs
      aria-label="Breadcrumb"
      classes={{ root: classes.breadcrumbs }}
    >
      {breadcrumbs.map((breadcrumb, i) => {
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
