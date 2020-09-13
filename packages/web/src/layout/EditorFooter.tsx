import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import { AdminOnly } from '@whitewater-guide/clients';
import React, { useMemo } from 'react';
import useRouter from 'use-react-router';

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

export const EditorFooter: React.FC<EditorFooterProps> = (props) => {
  const { adminOnly, add, administrate, edit, children } = props;
  const {
    match: { url },
    history: { push },
  } = useRouter();

  const handlers = useMemo(
    () => ({
      onAdd: () => push(`${url}/new`),
      onEdit: () => push(`${url}/settings`),
      onAdmin: () => push(`${url}/admin`),
    }),
    [url, push],
  );

  const Guard = adminOnly ? AdminOnly : EditorOnly;
  return (
    <Guard>
      <CardActions>
        {add && (
          <Button variant="contained" color="primary" onClick={handlers.onAdd}>
            Add new
          </Button>
        )}
        {edit && (
          <Button variant="contained" color="primary" onClick={handlers.onEdit}>
            Edit
          </Button>
        )}
        {administrate && (
          <AdminOnly>
            <Button variant="contained" onClick={handlers.onAdmin}>
              Administrate
            </Button>
          </AdminOnly>
        )}
        {children}
      </CardActions>
    </Guard>
  );
};
