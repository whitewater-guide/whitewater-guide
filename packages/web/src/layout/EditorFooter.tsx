import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { EditorOnly } from '../components/EditorOnly';
import { AdminOnly } from '../ww-clients/features/users';

export interface EditorFooterProps {
  // Not editors, admins only
  adminOnly?: boolean;
  // Should have 'Add new' button? If string, then it's custom href for add button
  add?: boolean;
  // Should have 'Edit' button? If string, then it's custom href for settings
  edit?: boolean;
  // Should have 'Admin' button? If string, then it's custom href for settings
  administrate?: boolean;
}

type InnerProps = EditorFooterProps & RouteComponentProps<any>;

const EditorFooterInternal: React.StatelessComponent<InnerProps> = (props) => {
  const { adminOnly, add, edit, administrate, location: { pathname }, history, children } = props;
  const addHref = history.createHref({ pathname: `${pathname}/new` });
  const editHref = history.createHref({ pathname: `${pathname}/settings` });
  const adminHref = history.createHref({ pathname: `${pathname}/admin` });
  const Guard = adminOnly ? AdminOnly : EditorOnly;
  return (
    <Guard>
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
          (
            <AdminOnly>
              <FlatButton label="Administrate" href={adminHref} />
            </AdminOnly>
          )
        }
        {children}
      </CardActions>
    </Guard>
  );
};

export const EditorFooter: React.ComponentType<EditorFooterProps> = withRouter(EditorFooterInternal);
