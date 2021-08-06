import Button from '@material-ui/core/Button';
import React from 'react';
import { Link } from 'react-router-dom';

const AnonMenu: React.FC = React.memo(() => (
  <Button color="inherit" component={Link} to="/signin">
    Sign in
  </Button>
));

AnonMenu.displayName = 'AnonMenu';

export default AnonMenu;
