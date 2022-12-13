import Paper from '@material-ui/core/Paper';
import Popper, { PopperProps } from '@material-ui/core/Popper';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { FC, PropsWithChildren } from 'react';

import { AutocompleteMenuProps } from './types';

const useStyles = makeStyles((theme) =>
  createStyles({
    popper: {
      zIndex: theme.zIndex.modal + 1,
    },
    paper: {
      maxHeight: 300,
      overflowY: 'auto',
    },
  }),
);

interface Props extends AutocompleteMenuProps {
  isOpen: boolean;
  anchorEl?: PopperProps['anchorEl'];
}

const AutocompleteMenu: FC<PropsWithChildren<Props>> = (props) => {
  const {
    isOpen,
    anchorEl,
    matchInputWidth = true,
    className,
    disablePortal,
    children,
    modifiers,
    placement,
  } = props;
  const classes = useStyles();
  return (
    <Popper
      open={isOpen}
      anchorEl={anchorEl}
      disablePortal={disablePortal}
      className={classes.popper}
      modifiers={modifiers}
      placement={placement}
    >
      <Paper
        square
        className={clsx(classes.paper, className)}
        style={{
          width:
            matchInputWidth && anchorEl
              ? (anchorEl as any).clientWidth
              : undefined,
        }}
      >
        {children}
      </Paper>
    </Popper>
  );
};

AutocompleteMenu.displayName = 'AutocompleteMenu';

export default AutocompleteMenu;
