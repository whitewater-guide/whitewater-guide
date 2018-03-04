import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { adminOnly } from '../components';

interface OuterProps {
  // Should have 'Add new' button? If string, then it's custom href for add button
  add?: string | boolean;
  // Should have 'Edit' button? If string, then it's custom href for settings
  edit?: string | boolean;
}

type InnerProps = OuterProps & RouteComponentProps<any>;

const AdminFooterInternal: React.StatelessComponent<InnerProps> = ({ add, edit, location: { pathname }, children }) => (
  <CardActions>
    {
      add &&
      <FlatButton label="Add new" href={typeof add === 'string' ? add : `${pathname}/new`} />
    }
    {
      edit &&
      <FlatButton label="Edit" href={typeof edit === 'string' ? edit : `${pathname}/settings`} />
    }
    {children}
  </CardActions>
);

export const AdminFooter = compose<InnerProps, OuterProps>(
  withRouter,
  adminOnly,
)(AdminFooterInternal);
