import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import { ConfirmationDialog } from './ConfirmationDialog';

interface Props {
  id?: string;
  deleteHandler: (id?: string) => void;
  disabled?: boolean;
  renderButton?: (
    onClick: React.MouseEventHandler<{}>,
    disabled?: boolean,
  ) => React.ReactNode;
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

  renderButton = () => {
    const { renderButton, disabled } = this.props;
    if (renderButton) {
      return renderButton(this.openDialog, disabled);
    }
    return (
      <IconButton disabled={disabled} onClick={this.openDialog}>
        <Icon>delete_forever</Icon>
      </IconButton>
    );
  };

  render() {
    return (
      <React.Fragment>
        {this.renderButton()}
        {this.state.dialogOpen && (
          <ConfirmationDialog
            title="Delete object?"
            description="Are you sure to delete this object?"
            onCancel={this.closeDialog}
            onConfirm={this.confirmDialog}
          />
        )}
      </React.Fragment>
    );
  }
}
