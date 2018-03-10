import { CardMedia } from 'material-ui/Card';
import { Tab } from 'material-ui/Tabs';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Content, Tabs } from '../../../components';
import { AdminFooter } from '../../../layout/';
import { RiversList, RiversRoute } from '../../rivers';
import { SectionsList, SectionsRoute } from '../../sections';
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
            <CardMedia style={{ height: '100%' }} mediaStyle={{ height: '100%' }}>
              <div style={{ width: '100%', height: '100%' }} >
                <Tabs fullPathMode>

                  <Tab label="Info" value={`/regions/${regionId}#main`}>
                    <RegionDetailsMain region={region.node} />
                  </Tab>

                  <Tab label="Map" value={`/regions/${regionId}#map`}>
                    {'MAP'}
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
                        <SectionsList sections={sections} />
                      </div>
                    </Route>
                  </Tab>

                </Tabs>
              </div>
            </CardMedia>
            <Switch>

              <Route exact path={`${match.path}/rivers`}>
                <AdminFooter add />
              </Route>

              <Route exact path={`${match.path}/sections`} />

              <Route>
                <AdminFooter edit />
              </Route>

            </Switch>
          </Content>
        </Route>
      </Switch>
    );
  }
}
