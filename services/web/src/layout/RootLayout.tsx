import { createStyles, makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useState } from 'react';
import AppErrorSnackbar from './AppErrorSnackbar';
import { Drawer } from './drawer';
import { Header } from './header';
import RootRouter from './RootRouter';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    },
  }),
);

export const RootLayout: React.FC = () => {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const onToggleDrawer = useCallback(() => setDrawerOpen(!drawerOpen), [
    drawerOpen,
    setDrawerOpen,
  ]);
  return (
    <div className={classes.root}>
      <Header onToggleDrawer={onToggleDrawer} />
      <RootRouter />
      <Drawer isOpen={drawerOpen} onClose={onToggleDrawer} />
      <AppErrorSnackbar />
    </div>
  );
};
