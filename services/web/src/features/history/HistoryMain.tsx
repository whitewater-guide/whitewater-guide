import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import React from 'react';
import { Card } from '../../layout';
import { DiffDialog } from './DiffDialog';
import HistoryTableContainer from './HistoryTableContainer';

interface State {
  openDiff: null | object;
}

class HistoryMain extends React.PureComponent<{}, State> {
  readonly state: State = { openDiff: null };

  onDiffClose = () => {
    this.setState({ openDiff: null });
  };

  onDiffOpen = (openDiff: object | null) => {
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
