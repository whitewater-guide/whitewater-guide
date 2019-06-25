import { AdminOnly } from '@whitewater-guide/clients';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { EditorOnly } from '../components/EditorOnly';

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

class EditorFooterInternal extends React.PureComponent<InnerProps> {
  onAdd = () => {
    const {
      history,
      location: { pathname },
    } = this.props;
    history.push(`${pathname}/new`);
  };

  onEdit = () => {
    const {
      history,
      location: { pathname },
    } = this.props;
    history.push(`${pathname}/settings`);
  };

  onAdmin = () => {
    const {
      history,
      location: { pathname },
    } = this.props;
    history.push(`${pathname}/admin`);
  };

  render() {
    const { adminOnly, add, edit, administrate, children } = this.props;
    const Guard = adminOnly ? AdminOnly : EditorOnly;
    return (
      <Guard>
        <CardActions>
          {add && <FlatButton label="Add new" onClick={this.onAdd} />}
          {edit && <FlatButton label="Edit" onClick={this.onEdit} />}
          {administrate && (
            <AdminOnly>
              <FlatButton label="Administrate" onClick={this.onAdmin} />
            </AdminOnly>
          )}
          <FlatButton
            label="Administrate"
            onClick={() => {
              throw new Error('Hello sentry!');
            }}
          />
          {children}
        </CardActions>
      </Guard>
    );
  }
}

export const EditorFooter: React.ComponentType<EditorFooterProps> = withRouter(
  EditorFooterInternal,
);
