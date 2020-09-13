import Box from '@material-ui/core/Box';
import CardHeader from '@material-ui/core/CardHeader';
import { useSection } from '@whitewater-guide/clients';
import { sectionName } from '@whitewater-guide/commons';
import ReactMarkdown from 'markdown-react-js';
import React from 'react';
import { Route, Switch } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';

import { Chart } from '../../../components/chart';
import { EditorLanguagePicker } from '../../../components/language';
import { Map } from '../../../components/maps';
import { NavTab, NavTabs } from '../../../components/navtabs';
import { Card, CardContent, EditorFooter } from '../../../layout';
import { SectionMedia } from '../../media';
import SectionInfo from './SectionInfo';

const SectionDetails: React.FC<RouteComponentProps> = React.memo((props) => {
  const { match } = props;
  const { node: section } = useSection();
  if (!section) {
    return null;
  }
  return (
    <Card>
      <CardHeader
        title={sectionName(section)}
        action={<EditorLanguagePicker />}
      />
      <CardContent>
        <NavTabs variant="fullWidth">
          <NavTab label="Map" value="/map" />
          <NavTab label="Flows" value="/flows" />
          <NavTab label="Info" value="/main" />
          <NavTab label="Description" value="/description" />
          <NavTab label="Media" value="/media" />
        </NavTabs>

        <Box flex={1} overflow="auto">
          <Switch>
            <Route exact={true} path={`${match.path}/map`}>
              <Box width={1} height={1}>
                <Map
                  detailed={true}
                  sections={[section]}
                  initialBounds={section.shape}
                  pois={section.pois}
                />
              </Box>
            </Route>

            <Route exact={true} path={`${match.path}/flows`}>
              <Chart gauge={section.gauge!} section={section} />
            </Route>

            <Route exact={true} path={`${match.path}/description`}>
              <Box padding={1}>
                <ReactMarkdown text={section.description || ''} />
              </Box>
            </Route>

            <Route path={`${match.path}/media`}>
              <SectionMedia />
            </Route>

            <Route>
              <SectionInfo section={section} />
            </Route>
          </Switch>
        </Box>
      </CardContent>
      <Switch>
        <Route path={`${match.url}/media`} />

        <Route>
          <EditorFooter edit={true} administrate={true} />
        </Route>
      </Switch>
    </Card>
  );
});

SectionDetails.displayName = 'SectionDetails';

export default SectionDetails;
