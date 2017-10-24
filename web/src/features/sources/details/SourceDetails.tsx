import { CardHeader, CardMedia } from 'material-ui/Card';
import { Tab } from 'material-ui/Tabs';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Content, Tabs } from '../../../components';

interface Params {
  sourceId?: string;
}

export class SourceDetails extends React.PureComponent<RouteComponentProps<Params>> {
  render() {
    const { match } = this.props;
    const { sourceId } = match.params;
    return (
      <Content card>
        <CardMedia style={{ height: '100%' }} mediaStyle={{ height: '100%' }}>
          <Tabs fullPathMode>
            <Tab label="Details" value={`/sources/${sourceId}`}>
              <h1>details</h1>
            </Tab>
            <Tab label="Gauges" value={`/sources/${sourceId}/gauges`}>
              <h1>gauges</h1>
            </Tab>
          </Tabs>
        </CardMedia>
      </Content>
    );
  }
}
