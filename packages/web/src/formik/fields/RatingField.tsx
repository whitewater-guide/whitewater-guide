import { createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import { useField } from 'formik';
import React, { useCallback } from 'react';

import { FormikFormControl } from '../helpers';
import { useFakeHandlers } from '../utils';

const useStyles = makeStyles(({ palette }) =>
  createStyles({
    label: {
      color: palette.grey[700],
    },
  }),
);

interface Props {
  name: string;
  label?: string;
}

export const RatingField: React.FC<Props> = React.memo((props) => {
  const { name, label } = props;
  const [field] = useField<number>(name);
  const { onChange } = useFakeHandlers(name);
  const classes = useStyles();
  // Because event.target.value is string
  const handleChange = useCallback((_, v) => onChange(v), [onChange]);
  return (
    <FormikFormControl name={name}>
      <Typography variant="caption" className={classes.label}>
        {label}
      </Typography>
      <Rating
        name={name}
        value={field.value}
        precision={0.5}
        onChange={handleChange}
      />
    </FormikFormControl>
  );
});

RatingField.displayName = 'RatingField';
