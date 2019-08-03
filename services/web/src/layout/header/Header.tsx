import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

import Toolbar from '@material-ui/core/Toolbar';
import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/breadcrumbs';
import { EditorOnly } from '../../components/EditorOnly';
import breadcrumbRoutes from '../breadcrumbRoutes';
import { AuthMenu } from './menu';
import { NotificationsMenu } from './notifications';

// tslint:disable-next-line:no-var-requires
const logo = require('./logo.png');

interface Props {
  onToggleDrawer?: () => void;
}

export const Header: React.FC<Props> = ({ onToggleDrawer }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="Menu"
          onClick={onToggleDrawer}
        >
          <Icon>menu</Icon>
        </IconButton>

        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>

        <Breadcrumbs routes={breadcrumbRoutes} />

        <Box flex={1} />

        <EditorOnly>
          <NotificationsMenu />
        </EditorOnly>

        <AuthMenu />
      </Toolbar>
    </AppBar>
  );
};
