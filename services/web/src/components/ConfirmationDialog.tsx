import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';

interface Props {
  title?: string;
  confirmTitle?: string;
  description?: string;
  cancelTitle?: string;
  invertedAccents?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmationDialog: React.FC<Props> = (props) => {
  const {
    title = 'Please confirm your action',
    description = 'Something requires your attention',
    confirmTitle = 'OK',
    cancelTitle = 'Cancel',
    invertedAccents = false,
    onCancel,
    onConfirm,
  }: Props = props;

  let actions = [
    <Button
      key="cancel"
      color={invertedAccents ? 'primary' : 'default'}
      onClick={onCancel}
    >
      {cancelTitle}
    </Button>,
    <Button
      key="confirm"
      color={invertedAccents ? 'default' : 'primary'}
      onClick={onConfirm}
    >
      {confirmTitle}
    </Button>,
  ];
  if (invertedAccents) {
    actions = actions.reverse();
  }

  return (
    <Dialog
      disableBackdropClick={true}
      disableEscapeKeyDown={true}
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
      open={true}
    >
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
};
