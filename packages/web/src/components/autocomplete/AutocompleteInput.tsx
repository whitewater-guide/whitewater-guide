import { makeStyles } from '@material-ui/core/styles';
import TextField, { StandardTextFieldProps } from '@material-ui/core/TextField';
import React, { forwardRef } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    flexWrap: 'wrap',
  },
  input: {
    width: 'auto',
    flexGrow: 1,
  },
}));

const AutocompleteInput: React.FC<StandardTextFieldProps> = forwardRef(
  (props, ref) => {
    const classes = useStyles();
    const { InputProps, ...other } = props;

    return (
      <TextField
        InputProps={{
          ...InputProps,
          inputRef: ref,
          classes,
        }}
        {...other}
      />
    );
  },
);

AutocompleteInput.displayName = 'AutocompleteInput';

export default AutocompleteInput;
