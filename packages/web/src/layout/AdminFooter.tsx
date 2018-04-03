import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { adminOnly } from '../components';

interface OuterProps {
  // Should have 'Add new' button? If string, then it's custom href for add button
  add?: string | boolean;
  // Should have 'Edit' button? If string, then it's custom href for settings
  edit?: string | boolean;
  // Should have 'Admin' button? If string, then it's custom href for settings
  administrate?: string | boolean;
}

type InnerProps = OuterProps & RouteComponentProps<any>;

const AdminFooterInternal: React.StatelessComponent<InnerProps> = (props) => {
  const { add, edit, administrate, location: { pathname }, history, children } = props;
  const addHref = history.createHref({ pathname: typeof add === 'string' ? add : `${pathname}/new` });
  const editHref = history.createHref({ pathname: typeof edit === 'string' ? edit : `${pathname}/settings` });
  const adminHref = history.createHref({
    pathname: typeof administrate === 'string' ? administrate : `${pathname}/admin`,
  });
  return (
    <CardActions>
      {
        add &&
        <FlatButton label="Add new" href={addHref} />
      }
      {
        edit &&
        <FlatButton label="Edit" href={editHref} />
      }
      {
        administrate &&
        <FlatButton label="Administrate" href={adminHref} />
      }
      {children}
    </CardActions>
  );
};

export const AdminFooter = compose<InnerProps, OuterProps>(
  withRouter,
  adminOnly,
)(AdminFooterInternal);
