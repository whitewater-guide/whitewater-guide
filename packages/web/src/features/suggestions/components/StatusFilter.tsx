import { Popover, PopoverOrigin } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { SuggestionStatus } from '@whitewater-guide/schema';
import React, { ChangeEvent, useCallback, useState } from 'react';

import updateStatusesArray from '../simple/updateStatusesArray';

const useStyles = makeStyles(({ spacing }) =>
  createStyles({
    root: {
      padding: spacing(1),
    },
    filterWrapper: {
      display: 'flex',
      alignItems: 'center',
    },
    filterButton: {
      marginLeft: spacing(1),
      transform: 'translateY(-2px)',
    },
    filterIcon: {
      fontSize: 16,
    },
  }),
);

const ANCHOR: PopoverOrigin = {
  vertical: 'top',
  horizontal: 'right',
};

interface Props {
  status: SuggestionStatus[];
  onChange: (status: SuggestionStatus[]) => void;
}

export const StatusFilter = React.memo<Props>((props) => {
  const { status, onChange } = props;
  const classes = useStyles();
  const [state, setState] = useState(status);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const onOpen = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget),
    [setAnchorEl],
  );
  const onClose = useCallback(() => {
    setAnchorEl(null);
    onChange(state);
  }, [state, onChange, setAnchorEl]);
  const onCheck = useCallback(
    (e: ChangeEvent<HTMLInputElement>, checked: boolean) => {
      setState(
        updateStatusesArray(state, e.target.value as SuggestionStatus, checked),
      );
    },
    [state, setState],
  );
  return (
    <>
      <div className={classes.filterWrapper}>
        <span>status</span>
        <IconButton onClick={onOpen} className={classes.filterButton}>
          <Icon className={classes.filterIcon}>filter_list</Icon>
        </IconButton>
      </div>
      <Popover
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={onClose}
        anchorOrigin={ANCHOR}
        transformOrigin={ANCHOR}
      >
        <FormControl component="fieldset" className={classes.root}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.indexOf(SuggestionStatus.Pending) >= 0}
                  onChange={onCheck}
                  value={SuggestionStatus.Pending}
                />
              }
              label="Pending"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.indexOf(SuggestionStatus.Accepted) >= 0}
                  onChange={onCheck}
                  value={SuggestionStatus.Accepted}
                />
              }
              label="Accepted"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.indexOf(SuggestionStatus.Rejected) >= 0}
                  onChange={onCheck}
                  value={SuggestionStatus.Rejected}
                />
              }
              label="Rejected"
            />
          </FormGroup>
        </FormControl>
      </Popover>
    </>
  );
});

StatusFilter.displayName = 'StatusFilter';
