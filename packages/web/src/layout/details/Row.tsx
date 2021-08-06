import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles(() =>
  createStyles({
    row: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      minHeight: 48,
    },
  }),
);

export const Row: React.FC = ({ children }) => {
  const classes = useStyles();
  return (
    <Grid item container className={classes.row} xs={12}>
      {children}
    </Grid>
  );
};
