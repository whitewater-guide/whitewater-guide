import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { adminOnly } from '../../components';

const Footer: React.StatelessComponent<RouteComponentProps<any>> = ({ location: { pathname }, children }) => (
  <CardActions>
    <FlatButton label="Add new" href={`${pathname}/new`} />
    {children}
  </CardActions>
);

export default compose(
  withRouter,
  adminOnly,
)(Footer) as React.ComponentType;
