import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
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
        <Icon>code</Icon>
      </IconButton>
    );
  }
}
