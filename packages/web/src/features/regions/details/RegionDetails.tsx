import { CardMedia } from 'material-ui/Card';
import { Tab } from 'material-ui/Tabs';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Content, Tabs } from '../../../components';
import { EditorLanguagePicker } from '../../../components/language';
import { CardHeader, EditorFooter } from '../../../layout/';
import { RiversList, RiversRoute } from '../../rivers';
import { SectionsList, SectionsRoute } from '../../sections';
import RegionMap from './map';
import RegionDetailsMain from './RegionDetailsMain';
import { RegionDetailsProps } from './types';

export class RegionDetails extends React.PureComponent<RegionDetailsProps> {
  render() {
    const { region, regionId, sections, match } = this.props;
    return (
      <Switch>
        <Route strict path={`${match.path}/rivers/`} component={RiversRoute} />

        <Route strict path={`${match.path}/sections/`} component={SectionsRoute} />

        <Route>
          <Content card>
            <CardHeader title={region.node.name}>
              <EditorLanguagePicker />
            </CardHeader>
            <CardMedia style={{ height: '100%' }} mediaStyle={{ height: '100%' }}>
              <div style={{ width: '100%', height: '100%' }} >
                <Tabs fullPathMode>

                  <Tab label="Info" value={`/regions/${regionId}#main`}>
                    <RegionDetailsMain region={region.node} />
                  </Tab>

                  <Tab label="Map" value={`/regions/${regionId}#map`}>
                    <RegionMap region={region.node} sections={sections.nodes} />
                  </Tab>

                  <Tab label="Rivers" value={`/regions/${regionId}/rivers`}>
                    <Route exact path={`${match.path}/rivers`}>
                      <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
                        <RiversList />
                      </div>
                    </Route>
                  </Tab>

                  <Tab label="Sections" value={`/regions/${regionId}/sections`}>
                    <Route exact path={`${match.path}/sections`}>
                      <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
                        <SectionsList sections={sections} regionId={regionId} />
                      </div>
                    </Route>
                  </Tab>

                </Tabs>
              </div>
            </CardMedia>
            <Switch>

              <Route exact path={`${match.path}/rivers`}>
                <EditorFooter add />
              </Route>

              <Route exact path={`${match.path}/sections`} />

              <Route>
                <EditorFooter edit administrate />
              </Route>

            </Switch>
          </Content>
        </Route>
      </Switch>
    );
  }
}
