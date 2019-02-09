import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import React from 'react';

interface Props {
  diff: object | null;
  onDiffOpen: (diff: object | null) => void;
}

export class DiffButton extends React.PureComponent<Props> {
  onClick = () => this.props.onDiffOpen(this.props.diff);

  render() {
    return (
      <IconButton onClick={this.onClick}>
        <FontIcon className="material-icons">code</FontIcon>
      </IconButton>
    );
  }
}
