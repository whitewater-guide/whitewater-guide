import { CardHeader, CardMedia } from 'material-ui/Card';
import { Tab } from 'material-ui/Tabs';
import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import { Content, Tabs } from '../../../components';
import { WithSource } from '../../../ww-clients/features/sources';
import { GaugesList } from '../../gauges';
import SourceDetailsMain from './SourceDetailsMain';

export class SourceDetails extends React.PureComponent<WithSource> {
  render() {
    const { source, sourceId } = this.props;
    return (
      <Content card>
        <CardMedia style={{ height: '100%' }} mediaStyle={{ height: '100%' }}>
          <div style={{ width: '100%', height: '100%' }} >
            <Tabs fullPathMode>
              <Tab label="Details" value={`/sources/${sourceId}#main`}>
                <SourceDetailsMain source={source.node} />
              </Tab>
              <Tab label="Terms of use" value={`/sources/${sourceId}#terms`}>
                <ReactMarkdown source={source.node.termsOfUse || ''} />
              </Tab>
              <Tab label="Gauges" value={`/sources/${sourceId}/gauges`}>
                <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
                  <GaugesList />
                </div>
              </Tab>
            </Tabs>
          </div>
        </CardMedia>
      </Content>
    );
  }
}
