import IconButton from 'material-ui/IconButton';
import React from 'react';
import { ConfirmationDialog } from './ConfirmationDialog';

interface Props {
  id: string;
  deleteHandler: (id: string) => void;
  disabled?: boolean;
}

interface State {
  dialogOpen: boolean;
}

export class DeleteButton extends React.PureComponent<Props, State> {
  state: State = { dialogOpen: false };

  openDialog = () => this.setState({ dialogOpen: true });

  closeDialog = () => this.setState({ dialogOpen: false });

  confirmDialog = () => {
    this.closeDialog();
    const { id, deleteHandler } = this.props;
    deleteHandler(id);
  };

  render() {
    return (
      <React.Fragment>
        <IconButton
          disabled={this.props.disabled}
          iconClassName="material-icons"
          onClick={this.openDialog}
        >
          delete_forever
        </IconButton>
        {
          this.state.dialogOpen &&
          (
            <ConfirmationDialog
              title="Delete object?"
              description="Are you sure to delete this object?"
              onCancel={this.closeDialog}
              onConfirm={this.confirmDialog}
            />
          )
        }
      </React.Fragment>
    );
  }
}
