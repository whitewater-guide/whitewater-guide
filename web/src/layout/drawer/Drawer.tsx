import MuiDrawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import * as React from 'react';
import { matchPath, NavLink, RouteComponentProps, withRouter } from 'react-router-dom';

const styles = {
  drawerContainer: {
    marginTop: 56,
    paddingTop: 16,
  },
};

const ITEMS = [
  { title: 'Regions', path: '/regions' },
  { title: 'Sources', path: '/sources' },
];

interface Props {
  isOpen: boolean;
  onChange: (open: boolean) => void;
}

type InnerProps = Props & RouteComponentProps<any>;

const Drawer: React.StatelessComponent<InnerProps> = ({ onChange, isOpen, location, history: { push } }) => {
  const value = '/' + location.pathname.split('/')[1];
  return (
    <MuiDrawer docked={false} open={isOpen} containerStyle={styles.drawerContainer} onRequestChange={onChange}>
      <Menu value={value}>
        {ITEMS.map(({ path, title }) => {
          const clickable = !matchPath(location.pathname, { path });
          const onClick = () => {
            onChange(false);
            if (clickable) {
              push(path);
            }
          };
          return (
            <MenuItem key={path} value={path} onClick={onClick}>
              {title}
            </MenuItem>
          );
          },
        )}
      </Menu>
    </MuiDrawer>
  );
};

export default withRouter<Props>(Drawer);
