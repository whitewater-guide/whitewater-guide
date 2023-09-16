import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import React from 'react';

import type { Diff } from './types';

interface Props {
  diff: Diff | null;
  onDiffOpen: (diff: Diff | null) => void;
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
