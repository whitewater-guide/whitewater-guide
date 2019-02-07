import { CardMedia } from 'material-ui/Card';
import React from 'react';
import { Content } from '../../components';
import { CardHeader } from '../../layout';
import HistoryTableContainer from './HistoryTableContainer';

class HistoryMain extends React.PureComponent {
  render(): React.ReactNode {
    return (
      <Content card>
        <CardHeader title="History of edits" />
        <CardMedia style={{ height: '100%' }} mediaStyle={{ height: '100%' }}>
          <HistoryTableContainer />
        </CardMedia>
      </Content>
    );
  }
}

export default HistoryMain;
