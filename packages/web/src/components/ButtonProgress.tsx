import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles(({ palette }) =>
  createStyles({
    wrapper: {
      position: 'relative',
    },
    progress: {
      color: palette.secondary.main,
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  }),
);

interface Props {
  loading?: boolean;
  className?: string;
}

export const ButtonProgress: React.FC<Props> = ({
  loading,
  children,
  className,
}) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.wrapper, className)}>
      {children}
      {loading && <CircularProgress size={24} className={classes.progress} />}
    </div>
  );
};

ButtonProgress.displayName = 'ButtonProgress';
