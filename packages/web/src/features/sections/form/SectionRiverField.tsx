import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import TextInput from '@material-ui/core/TextField';
import { NEW_RIVER_ID } from '@whitewater-guide/commons';
import { NamedNode } from '@whitewater-guide/schema';
import { useFormikContext } from 'formik';
import upperFirst from 'lodash/upperFirst';
import React, {
  ChangeEvent,
  Reducer,
  useCallback,
  useReducer,
  useState,
} from 'react';
import { useRouteMatch } from 'react-router';

import { RiverFinder } from '../../../components';
import { TextField } from '../../../formik/fields';
import { RouterParams } from './types';

interface State {
  selected: NamedNode | null;
  input: string;
}

type Action =
  | {
      type: 'select';
      value: NamedNode | null;
    }
  | {
      type: 'input';
      value: string;
    };

const reducer: Reducer<State, Action> = (state: State, action: Action) => {
  switch (action.type) {
    case 'input':
      return { input: action.value, selected: null };
    case 'select':
      return { input: '', selected: action.value };
    default:
    // do nothing
  }
  return state;
};

export const SectionRiverField: React.FC = React.memo(() => {
  const match = useRouteMatch<RouterParams>();
  const { regionId } = match.params;

  const { values, setFieldTouched, setFieldValue } = useFormikContext<any>();

  const { river } = values;
  const [state, dispatch] = useReducer(reducer, { selected: river, input: '' });

  const [dialogOpen, setDialogOpen] = useState(false);
  const openDialog = useCallback(() => setDialogOpen(true), [setDialogOpen]);
  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    setFieldTouched('river.name', true);
  }, [setDialogOpen, setFieldTouched]);

  const onInput = useCallback(
    (e: ChangeEvent<{ value: string }>) =>
      dispatch({ type: 'input', value: e.target.value }),
    [dispatch],
  );

  const onSelect = useCallback(
    (value: NamedNode | null) => dispatch({ type: 'select', value }),
    [dispatch],
  );

  const onSubmit = useCallback(() => {
    setFieldValue(
      'river',
      state.selected || {
        id: NEW_RIVER_ID,
        name: upperFirst(state.input).trim(),
      },
    );
    closeDialog();
  }, [setFieldValue, state, closeDialog]);

  return (
    <>
      <TextField
        fullWidth
        readOnly
        onClick={openDialog}
        name="river.name"
        errorFieldName="river"
        label="River"
      />
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>Select or create a river</DialogTitle>
        <DialogContent>
          <RiverFinder
            allowNull
            value={state.selected}
            onChange={onSelect}
            regionId={regionId}
            limit={12}
          />
          <Divider />
          <Typography variant="overline">or create new river</Typography>
          <TextInput
            value={state.input}
            onChange={onInput}
            fullWidth
            placeholder="New river name"
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            disabled={!state.input && !state.selected}
            onClick={onSubmit}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

SectionRiverField.displayName = 'SectionRiverField';
