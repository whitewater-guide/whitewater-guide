import IconButton from 'material-ui/IconButton';
import React from 'react';

interface Props {
  id: string;
  deleteHandler: (id: string) => void;
  disabled?: boolean;
}

export class DeleteButton extends React.PureComponent<Props> {
  onClick = () => {
    const { id, deleteHandler } = this.props;
    deleteHandler(id);
  };

  render() {
    return (
      <IconButton
        disabled={this.props.disabled}
        iconClassName="material-icons"
        onClick={this.onClick}
      >
        delete_forever
      </IconButton>
    );
  }
}
