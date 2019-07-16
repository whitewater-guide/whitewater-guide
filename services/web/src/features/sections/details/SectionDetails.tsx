import { useSection } from '@whitewater-guide/clients';
import { sectionName } from '@whitewater-guide/commons';
import { CardMedia } from 'material-ui/Card';
import { Tab } from 'material-ui/Tabs';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Route, Switch } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';
import { Content, Tabs } from '../../../components';
import { Chart } from '../../../components/chart';
import { EditorLanguagePicker } from '../../../components/language';
import { Map } from '../../../components/maps';
import { CardHeader, EditorFooter } from '../../../layout';
import { SectionMedia } from '../../media';
import SectionInfo from './SectionInfo';

const SectionDetails: React.FC<RouteComponentProps> = React.memo((props) => {
  const {
    match: { url },
  } = props;
  const { node: section } = useSection();
  if (!section) {
    return null;
  }
  return (
    <Content card={true}>
      <CardHeader title={sectionName(section)}>
        <EditorLanguagePicker />
      </CardHeader>
      <CardMedia style={{ height: '100%' }} mediaStyle={{ height: '100%' }}>
        <div style={{ width: '100%', height: '100%' }}>
          <Tabs fullPathMode={true}>
            <Tab label="Map" value={`${url}#map`}>
              <Map
                detailed={true}
                sections={[section]}
                initialBounds={section.shape}
                pois={section.pois}
              />
            </Tab>

            <Tab label="Flow Info" value={`${url}#flow`}>
              <Chart gauge={section.gauge!} section={section} />
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
        <Route exact={true} path={`${url}/media`} />

        <Route>
          <EditorFooter edit={true} administrate={true} />
        </Route>
      </Switch>
    </Content>
  );
});

SectionDetails.displayName = 'SectionDetails';

export default SectionDetails;
