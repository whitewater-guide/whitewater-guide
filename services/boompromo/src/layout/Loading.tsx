import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles((theme) =>
  createStyles({
    loading: {
      width: '100%',
      height: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
);

const Loading: React.FC = React.memo(() => {
  const classes = useStyles();
  return (
    <div className={classes.loading}>
      <CircularProgress />{' '}
    </div>
  );
});

Loading.displayName = 'Loading';

export default Loading;
