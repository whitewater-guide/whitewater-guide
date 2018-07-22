import MuiDrawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import React from 'react';
import { matchPath, RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withMe, WithMe } from '../../ww-clients/features/users';

const styles = {
  drawerContainer: {
    marginTop: 56,
    paddingTop: 16,
  },
};

const ITEMS = [
  { title: 'Regions', path: '/regions', admin: false },
  { title: 'Sources', path: '/sources', admin: false },
  { title: 'Tags', path: '/tags', admin: true },
  { title: 'Region Groups', path: '/groups', admin: true },
];

interface Props {
  isOpen: boolean;
  onChange: (open: boolean) => void;
}

type InnerProps = Props & RouteComponentProps<any> & WithMe;

const Drawer = ({ onChange, isOpen, location, history: { push }, me }: InnerProps) => {
  const value = '/' + location.pathname.split('/')[1];
  return (
    <MuiDrawer docked={false} open={isOpen} containerStyle={styles.drawerContainer} onRequestChange={onChange}>
      <Menu disableAutoFocus value={value}>
        {ITEMS.map(({ path, title, admin }) => {
          if (admin && !(me && me.admin)) {
            return null;
          }
          const clickable = !matchPath(location.pathname, { path, exact: true });
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

export default compose<InnerProps, Props>(
  withRouter,
  withMe,
)(Drawer);
