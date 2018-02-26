import IconButton from 'material-ui/IconButton';
import * as React from 'react';

interface Props {
  id: string;
  deleteHandler: (id: string) => void;
}

export class DeleteButton extends React.PureComponent<Props> {
  onClick = () => {
    const { id, deleteHandler } = this.props;
    deleteHandler(id);
  };

  render() {
    return (
      <IconButton iconClassName="material-icons" onClick={this.onClick}>
        delete_forever
      </IconButton>
    );
  }
}
