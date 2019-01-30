import { CardMedia } from 'material-ui/Card';
import { Tab } from 'material-ui/Tabs';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Route, Switch } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';
import { Content, Tabs } from '../../../components';
import { EditorLanguagePicker } from '../../../components/language';
import { CardHeader, EditorFooter } from '../../../layout';
import { WithSection } from '@whitewater-guide/clients';
import { SectionMedia } from '../../media';
import SectionInfo from './SectionInfo';

export default class SectionDetails extends React.PureComponent<
  WithSection & RouteComponentProps<any>
> {
  render() {
    const {
      section: { node: section },
      match: { url },
    } = this.props;
    if (!section) {
      return null;
    }
    return (
      <Content card>
        <CardHeader title={`${section.river.name} - ${section.name}`}>
          <EditorLanguagePicker />
        </CardHeader>
        <CardMedia style={{ height: '100%' }} mediaStyle={{ height: '100%' }}>
          <div style={{ width: '100%', height: '100%' }}>
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
        <Switch>
          <Route exact path={`${url}/media`} />

          <Route>
            <EditorFooter edit administrate />
          </Route>
        </Switch>
      </Content>
    );
  }
}
