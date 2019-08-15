import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import clipboard from 'clipboard-copy';
import React, { useCallback } from 'react';

interface Props {
  description: string;
  open: boolean;
  onClose: () => void;
}

const LongDescriptionDialog: React.FC<Props> = React.memo((props) => {
  const { description, open, onClose } = props;
  const onClick = useCallback(() => {
    clipboard(description).catch(() => {});
  }, [description]);
  return (
    <Dialog open={open} onClose={onClose} scroll="paper">
      <DialogTitle>User's suggestion</DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClick}>Copy to clipboard</Button>
      </DialogActions>
    </Dialog>
  );
});

LongDescriptionDialog.displayName = 'LongDescriptionDialog';

export default LongDescriptionDialog;
