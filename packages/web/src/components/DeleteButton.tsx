import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import React, { useState } from 'react';

import { ConfirmationDialog } from './ConfirmationDialog';

interface ButtonProps {
  onClick: React.MouseEventHandler<unknown>;
  disabled?: boolean;
}

interface Props {
  id?: string;
  disabled?: boolean;
  deleteHandler?: (id?: string) => void;
  children?: React.ReactElement<ButtonProps>;
}

export const DeleteButton = React.memo(
  ({ id, disabled, deleteHandler, children }: Props) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const openDialog = (e: React.MouseEvent<any>) => {
      e.stopPropagation();
      setDialogOpen(true);
    };

    const closeDialog = (e: React.MouseEvent<any>) => {
      e.stopPropagation();
      setDialogOpen(false);
    };

    const confirmDialog = (e: React.MouseEvent<any>) => {
      e.stopPropagation();
      setDialogOpen(false);
      deleteHandler?.(id);
    };

    return (
      <React.Fragment>
        {children ? (
          React.cloneElement(React.Children.only(children), {
            onClick: openDialog,
            disabled,
          })
        ) : (
          <IconButton disabled={disabled} onClick={openDialog}>
            <Icon>delete_forever</Icon>
          </IconButton>
        )}
        {dialogOpen && (
          <ConfirmationDialog
            title="Delete object?"
            description="Are you sure to delete this object?"
            onCancel={closeDialog}
            onConfirm={confirmDialog}
          />
        )}
      </React.Fragment>
    );
  },
);

DeleteButton.displayName = 'DeleteButton';
