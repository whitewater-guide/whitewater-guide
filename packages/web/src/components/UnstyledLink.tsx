import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Link } from 'react-router-dom';

import { paths, PathsOpts } from '../utils';

const useStyles = makeStyles(() =>
  createStyles({
    link: {
      textDecoration: 'none',
      color: 'inherit',
    },
  }),
);

interface Props extends PathsOpts {
  children?: React.ReactNode;
}

export const UnstyledLink = React.memo<Props>(({ children, ...opts }) => {
  const classes = useStyles();
  return (
    <Link to={paths.to(opts)} className={classes.link}>
      {children}
    </Link>
  );
});

UnstyledLink.displayName = 'UnstyledLink';
