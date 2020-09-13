import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';

import useResolveSuggestion from './useResolveSuggestion';

interface Props {
  suggestionId: string | null;
  onClose: () => void;
}

const SuggestionResolveDialog: React.FC<Props> = React.memo((props) => {
  const { suggestionId, onClose } = props;
  const { accept, reject } = useResolveSuggestion(suggestionId!, onClose);
  return (
    <Dialog
      open={!!suggestionId}
      onClose={onClose}
      aria-labelledby="resolve-dialog-title"
      aria-describedby="resolve-dialog-description"
    >
      <DialogTitle id="resolve-dialog-title">
        Resolve user suggestion
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="resolve-dialog-description">
          Media will be added to section automatically. For text suggestions,
          however, you&lsquo;ll have to update section info manyally.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={reject}>Reject</Button>
        <Button onClick={accept} color="primary">
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
});

SuggestionResolveDialog.displayName = 'SuggestionResolveDialog';

export default SuggestionResolveDialog;
