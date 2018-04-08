import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
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

export const ConfirmationDialog: React.StatelessComponent<Props> = (props) => {
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
    <FlatButton key="cancel" primary={invertedAccents} label={cancelTitle} onClick={onCancel} />,
    <FlatButton key="confirm" primary={!invertedAccents} label={confirmTitle} onClick={onConfirm} />,
  ];
  if (invertedAccents) {
    actions = actions.reverse();
  }

  return (
    <Dialog
      open
      modal
      title={title}
      actions={actions}
    >
      {description}
    </Dialog>
  );
};
