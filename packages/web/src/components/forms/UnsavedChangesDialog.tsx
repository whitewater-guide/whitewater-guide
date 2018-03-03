import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import * as React from 'react';

interface Props {
  onCancel: () => void;
  onConfirm: () => void;
}

const UnsavedChangesDialog: React.StatelessComponent<Props> = ({ onConfirm, onCancel }) => {
  const actions = [
    <FlatButton key="confirm" label="Leave" onClick={onConfirm} />,
    <FlatButton key="cancel" primary label="Stay" onClick={onCancel} />,
  ];

  return (
    <Dialog
      open
      modal
      title="Please confirm navigation"
      actions={actions}
    >
      There are some unsaved changes, are sure you don't want to save them?
    </Dialog>
  );
};

export default UnsavedChangesDialog;
