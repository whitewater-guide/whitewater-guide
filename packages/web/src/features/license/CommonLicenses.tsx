import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { COMMON_LICENSES, License } from '@whitewater-guide/commons';
import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import useBoolean from 'react-use/lib/useBoolean';

const useStyles = makeStyles(() =>
  createStyles({
    content: {
      overflowX: 'hidden',
    },
  }),
);

interface Props {
  name: string;
}

const CommonLicenses: React.FC<Props> = ({ name }) => {
  const [value, setValue] = useState(COMMON_LICENSES[0]);
  const [open, toggleOpen] = useBoolean(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { setFieldValue, setFieldTouched } = useFormikContext<any>();
  const classes = useStyles();

  const handleSelect = () => {
    toggleOpen(false);
    setFieldValue(name, value);
    setFieldTouched(name, true);
  };

  return (
    <React.Fragment>
      <Button color="primary" variant="text" onClick={toggleOpen}>
        Select one of standard licenses...
      </Button>

      <Dialog open={open} onClose={toggleOpen}>
        <DialogTitle>Select license</DialogTitle>

        <DialogContent className={classes.content}>
          <Select
            value={value}
            onChange={(e) => setValue(e.target.value as License)}
          >
            {COMMON_LICENSES.map((l, i) => (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              <MenuItem key={i} value={l as any}>
                {l.name}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>

        <DialogActions>
          <Button onClick={toggleOpen}>Cancel</Button>
          <Button onClick={handleSelect} color="primary">
            Select
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default CommonLicenses;
