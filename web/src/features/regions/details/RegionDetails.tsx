import { CardActions, CardHeader, CardMedia } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { Tab } from 'material-ui/Tabs';
import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { Content, Tabs } from '../../../components';
import ListAdminFooter from '../../../layout/list/ListAdminFooter';
import { WithRegion } from '../../../ww-clients/features/regions';
import RegionDetailsMain from './RegionDetailsMain';

export class RegionDetails extends React.PureComponent<WithRegion & RouteComponentProps<any>> {
  render() {
    const { region, regionId, match, location } = this.props;
    return (
      <Switch>
        <Route strict path={`${match.path}/rivers/`} component={() => null} />

        <Route strict path={`${match.path}/sections/`} component={() => null} />

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
                        {'Rivers'}
                      </div>
                    </Route>
                  </Tab>

                  <Tab label="Sections" value={`/regions/${regionId}/sections`}>
                    <Route exact path={`${match.path}/sections`}>
                      <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
                        {'Sections'}
                      </div>
                    </Route>
                  </Tab>

                </Tabs>
              </div>
            </CardMedia>
            <Switch>

              <Route exact path={`${match.path}/rivers`}>
                <ListAdminFooter/>
              </Route>

              <Route exact path={`${match.path}/sections`}>
                <ListAdminFooter/>
              </Route>

              <Route>
                <CardActions>
                  <FlatButton label="Edit" href={`${match.url}/settings${location.hash}`} />
                </CardActions>
              </Route>

            </Switch>
          </Content>
        </Route>
      </Switch>
    );
  }
}
