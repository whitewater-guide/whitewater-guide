import { CardMedia } from 'material-ui/Card';
import { Tab } from 'material-ui/Tabs';
import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import { RouteComponentProps } from 'react-router-dom';
import { Content, Tabs } from '../../../components';
import { AdminFooter } from '../../../layout';
import { WithSection } from '../../../ww-clients/features/sections';
import { SectionMedia } from '../../media';
import SectionInfo from './SectionInfo';

export default class SectionDetails extends React.PureComponent<WithSection & RouteComponentProps<any>> {
  render() {
    const { section: { node: section }, match: { url } } = this.props;
    return (
      <Content card>
        <CardMedia style={{ height: '100%' }} mediaStyle={{ height: '100%' }}>
          <div style={{ width: '100%', height: '100%' }} >
            <Tabs fullPathMode>

              <Tab label="Map" value={`${url}#map`}>
                <span>Map</span>
              </Tab>

              <Tab label="Flow Info" value={`${url}#flow`}>
                <span>Flow</span>
              </Tab>

              <Tab label="Info" value={`${url}#main`}>
                <SectionInfo section={section} />
              </Tab>

              <Tab label="Description" value={`${url}#description`}>
                <ReactMarkdown source={section.description || ''} />
              </Tab>

              <Tab label="Media" value={`${url}/media`}>
                <SectionMedia />
              </Tab>

            </Tabs>
          </div>
        </CardMedia>
        <AdminFooter edit />
      </Content>
    );
  }
}
