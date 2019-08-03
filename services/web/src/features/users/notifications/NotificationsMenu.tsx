import Badge from '@material-ui/core/Badge';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';
import useSuggestionsCount from './useSuggestionsCount';

const useStyles = makeStyles(({ spacing }) =>
  createStyles({
    badge: {
      margin: spacing(0, 2),
    },
  }),
);

export const NotificationsMenu: React.FC = React.memo(() => {
  const classes = useStyles();
  const count = useSuggestionsCount();
  if (count === null) {
    return null;
  }
  return (
    <IconButton className={classes.badge} color="inherit">
      <Badge badgeContent={count} color="secondary" max={9}>
        <Icon>notifications</Icon>
      </Badge>
    </IconButton>
  );
});

NotificationsMenu.displayName = 'NotificationsMenu';
