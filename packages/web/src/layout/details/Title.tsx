import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      fontWeight: 'bold',
    },
  }),
);

export const Title: React.FC = ({ children }) => {
  const classes = useStyles();
  return (
    <Grid item xs={3} className={classes.title}>
      {children}
    </Grid>
  );
};
