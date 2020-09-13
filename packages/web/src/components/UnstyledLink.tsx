import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Link } from 'react-router-dom';

import { paths, PathsOpts } from '../utils';

const useStyles = makeStyles((theme) =>
  createStyles({
    link: {
      textDecoration: 'none',
      color: 'inherit',
    },
  }),
);

export const UnstyledLink: React.FC<PathsOpts> = React.memo(
  ({ children, ...opts }) => {
    const classes = useStyles();
    return (
      <Link to={paths.to(opts)} className={classes.link}>
        {children}
      </Link>
    );
  },
);

UnstyledLink.displayName = 'UnstyledLink';
