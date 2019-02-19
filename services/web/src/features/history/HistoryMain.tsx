import { CardMedia } from 'material-ui/Card';
import React from 'react';
import { Content } from '../../components';
import { CardHeader } from '../../layout';
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
      <Content card={true}>
        <CardHeader title="History of edits" />
        <CardMedia style={{ height: '100%' }} mediaStyle={{ height: '100%' }}>
          <HistoryTableContainer onDiffOpen={this.onDiffOpen} />
        </CardMedia>
        {!!openDiff && (
          <DiffDialog diff={openDiff} onRequestClose={this.onDiffClose} />
        )}
      </Content>
    );
  }
}

export default HistoryMain;
