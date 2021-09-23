import { createStyles, makeStyles } from '@material-ui/core/styles';
import Tabs, { TabsProps } from '@material-ui/core/Tabs';
import React from 'react';
import { useLocation, useRouteMatch } from 'react-router';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  }),
);

export const NavTabs: React.FC<Omit<TabsProps, 'value'>> = (props) => {
  const classes = useStyles();
  const location = useLocation();
  const match = useRouteMatch();
  const base = match.url;
  const value = location.pathname.replace(base, '') || '/main';
  return <Tabs {...props} classes={classes} value={value} />;
};

export const HashTabs: React.FC<Omit<TabsProps, 'value'>> = (props) => {
  const classes = useStyles();
  const location = useLocation();
  const value = location.hash || '#main';
  return <Tabs {...props} classes={classes} value={value} />;
};
