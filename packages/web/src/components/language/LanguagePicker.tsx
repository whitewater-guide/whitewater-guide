import MenuItem from '@material-ui/core/MenuItem';
import type { SelectProps } from '@material-ui/core/Select';
import Select from '@material-ui/core/Select';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React, { useCallback } from 'react';

const useStyles = makeStyles((theme) =>
  createStyles({
    select: {
      '&:before': {
        borderBottomColor: theme.palette.primary.contrastText,
      },
      '&:hover:not(.Mui-disabled):before': {
        borderBottomColor: theme.palette.primary.contrastText,
      },
    },
    root: {
      minWidth: 200,
      color: theme.palette.primary.contrastText,
    },
    icon: {
      color: theme.palette.primary.contrastText,
    },
  }),
);

export type LanguagePickerProps = {
  language: string;
  onLanguageChange: (language: string) => void;
} & Omit<SelectProps, 'value' | 'onChange'>;

export const LanguagePicker: React.FC<LanguagePickerProps> = (props) => {
  const { language, onLanguageChange, ...rest } = props;
  const classes = useStyles();
  const onChange = useCallback(
    (e: React.ChangeEvent<{ value: string }>) =>
      onLanguageChange(e.target.value),
    [onLanguageChange],
  );
  return (
    <Select
      {...rest}
      classes={classes}
      value={language}
      onChange={onChange}
      className={classes.select}
    >
      <MenuItem value="en">English</MenuItem>
      <MenuItem value="ru">Russian</MenuItem>
      <MenuItem value="es">Spanish</MenuItem>
      <MenuItem value="fr">French</MenuItem>
      <MenuItem value="de">German</MenuItem>
      <MenuItem value="pt">Portuguese</MenuItem>
      <MenuItem value="it">Italian</MenuItem>
    </Select>
  );
};
