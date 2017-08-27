import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import * as React from 'react';
import { adminOnly } from '../../../components';

const Footer: React.StatelessComponent = () => (
  <CardActions>
    <FlatButton label="Add new"/>
  </CardActions>
);

export default adminOnly(Footer);