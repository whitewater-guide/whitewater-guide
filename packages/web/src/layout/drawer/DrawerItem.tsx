import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React, { useCallback } from 'react';
import { matchPath, useHistory, useLocation } from 'react-router';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(() =>
  createStyles({
    link: {
      textDecoration: 'none',
      color: 'inherit',
    },
  }),
);

interface Props {
  path: string;
  selected: string;
  title: string;
  onClose: () => void;
}

const DrawerItem = React.memo<Props>((props) => {
  const { path, selected, title, onClose } = props;
  const { push } = useHistory();
  const { pathname } = useLocation();
  const classes = useStyles();

  const onClick = useCallback(() => {
    const clickable = !matchPath(pathname, {
      path,
      exact: true,
    });
    onClose();
    if (clickable) {
      push(path);
    }
  }, [path, pathname, push, onClose]);

  return (
    <ListItem key={path} button selected={selected === path} onClick={onClick}>
      <ListItemText>
        <Link to={path} className={classes.link}>
          {title}
        </Link>
      </ListItemText>
    </ListItem>
  );
});

DrawerItem.displayName = 'DrawerItem';

export default DrawerItem;
