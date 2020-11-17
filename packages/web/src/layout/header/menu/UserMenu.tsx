import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';
import Popover, { PopoverOrigin } from '@material-ui/core/Popover';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useAuth } from '@whitewater-guide/clients';
import React, { useCallback, useState } from 'react';

const ANCHOR_ORIGIN: PopoverOrigin = {
  vertical: 'bottom',
  horizontal: 'right',
};

const TRANSFORM_ORIGIN: PopoverOrigin = {
  vertical: 'top',
  horizontal: 'right',
};

const useStyles = makeStyles(() =>
  createStyles({
    avatar: {
      cursor: 'pointer',
    },
  }),
);

const UserMenu: React.FC = React.memo(() => {
  const classes = useStyles();
  const { me, service } = useAuth();
  const [anchor, setAnchor] = useState<any>(null);
  const userpic = (me && me.avatar) || undefined;

  const onAvatarPress = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setAnchor(e.currentTarget);
    },
    [setAnchor],
  );

  const onPopoverClose = useCallback(() => setAnchor(null), [setAnchor]);

  const onSignOut = useCallback(() => {
    setAnchor(null);
    service.signOut();
  }, [setAnchor, service]);

  return (
    <React.Fragment>
      <Avatar onClick={onAvatarPress} className={classes.avatar} src={userpic}>
        {me!.name[0]}
      </Avatar>
      <Popover
        anchorEl={anchor}
        open={!!anchor}
        anchorOrigin={ANCHOR_ORIGIN}
        transformOrigin={TRANSFORM_ORIGIN}
        onClose={onPopoverClose}
      >
        <MenuItem onClick={onSignOut}>Sign out</MenuItem>
      </Popover>
    </React.Fragment>
  );
});

UserMenu.displayName = 'UserMenu';

export default UserMenu;
