import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

const useStyles = makeStyles((theme) =>
  createStyles({
    avatar: {
      cursor: 'pointer',
      textDecoration: 'none',
    },
    fb: { width: 'auto' },
  }),
);

const AdapterLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => <Link innerRef={ref as any} {...props} />,
);

const AnonMenu: React.FC = React.memo(() => {
  const classes = useStyles();
  return (
    <Avatar component={AdapterLink} className={classes.avatar} to="/signin">
      <Icon className={clsx('fa', 'fa-facebook', classes.fb)} />
    </Avatar>
  );
});

AnonMenu.displayName = 'AnonMenu';

export default AnonMenu;
