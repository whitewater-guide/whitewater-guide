import Badge from '@material-ui/core/Badge';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React, { memo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import useSuggestionsCount from './useSuggestionsCount';

const useStyles = makeStyles(({ spacing }) =>
  createStyles({
    badge: {
      margin: spacing(0, 2),
    },
  }),
);

export const NotificationsMenu = memo(() => {
  const { push } = useHistory();
  const classes = useStyles();
  const count = useSuggestionsCount();
  const onClick = useCallback(() => push('/suggestions'), [push]);
  if (count === null) {
    return null;
  }
  return (
    <IconButton className={classes.badge} color="inherit" onClick={onClick}>
      <Badge badgeContent={count} color="secondary" max={9}>
        <Icon>notifications</Icon>
      </Badge>
    </IconButton>
  );
});

NotificationsMenu.displayName = 'NotificationsMenu';
