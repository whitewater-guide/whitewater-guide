import Box from '@material-ui/core/Box';
import MUIDrawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useAuth } from '@whitewater-guide/clients';
import React from 'react';
import { useLocation } from 'react-router';

import { DRAWER_WIDTH } from './constants';
import DrawerItem from './DrawerItem';
import { usePermanentDrawer } from './usePermanentDrawer';

const useStyles = makeStyles(() =>
  createStyles({
    drawer: {
      width: DRAWER_WIDTH,
      flexShrink: 0,
    },
    drawerPaper: {
      width: DRAWER_WIDTH,
    },
  }),
);

interface DrawerEntry {
  title: string;
  path: string;
  admin?: boolean;
  editor?: boolean;
  authenticated?: boolean;
}

const ITEMS: DrawerEntry[] = [
  { title: 'Regions', path: '/regions', admin: false },
  { title: 'Sources', path: '/sources', admin: false },
  { title: 'Tags', path: '/tags', admin: true },
  { title: 'Region Groups', path: '/groups', admin: true },
  { title: 'Banners', path: '/banners', admin: true },
  { title: 'History of edits', path: '/history', admin: true },
  { title: 'User suggestions', path: '/suggestions', editor: true },
  { title: 'Users', path: '/users', admin: true },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const Drawer: React.FC<Props> = ({ onClose, isOpen }) => {
  const classes = useStyles();
  const location = useLocation();
  const permanent = usePermanentDrawer();
  const { me } = useAuth();
  const value = `/${location.pathname.split('/')[1]}`;
  return (
    <MUIDrawer
      open={isOpen}
      onClose={onClose}
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
      variant={permanent ? 'permanent' : 'temporary'}
    >
      <List component="nav">
        {ITEMS.map(({ path, title, admin, editor, authenticated }) => {
          if (authenticated && !me) {
            return null;
          }
          if (admin && !me?.admin) {
            return null;
          }
          if (editor && !(me && (me.admin || me.editor))) {
            return null;
          }
          return (
            <DrawerItem
              key={path}
              path={path}
              title={title}
              selected={value}
              onClose={onClose}
            />
          );
        })}
      </List>
      <Box flex={1} display="flex" alignItems="flex-end" m={1} ml={2}>
        <Typography variant="caption">{`Version: ${process.env.REACT_APP_VERSION}`}</Typography>
      </Box>
    </MUIDrawer>
  );
};
