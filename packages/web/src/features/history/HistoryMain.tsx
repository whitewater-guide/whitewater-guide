import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import React from 'react';

import { Card } from '../../layout';
import { DiffDialog } from './DiffDialog';
import HistoryTableContainer from './HistoryTableContainer';
import type { Diff } from './types';

interface State {
  openDiff: null | Diff;
}

class HistoryMain extends React.PureComponent<unknown, State> {
  readonly state: State = { openDiff: null };

  onDiffClose = () => {
    this.setState({ openDiff: null });
  };

  onDiffOpen = (openDiff: Diff | null) => {
    this.setState({ openDiff });
  };

  render(): React.ReactNode {
    const { openDiff } = this.state;
    return (
      <Card>
        <CardHeader title="History of edits" />
        <CardContent>
          <HistoryTableContainer onDiffOpen={this.onDiffOpen} />
        </CardContent>
        {!!openDiff && (
          <DiffDialog diff={openDiff} onRequestClose={this.onDiffClose} />
        )}
      </Card>
    );
  }
}

export default HistoryMain;
