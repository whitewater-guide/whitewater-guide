import { CardActions, CardHeader, CardMedia } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { Tab } from 'material-ui/Tabs';
import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { Content, Tabs } from '../../../components';
import ListAdminFooter from '../../../layout/list/ListAdminFooter';
import { WithSource } from '../../../ww-clients/features/sources';
import { GaugesList, GaugesRoute } from '../../gauges';
import SourceDetailsMain from './SourceDetailsMain';
import ToggleAllGaugesButton from './ToggleAllGaugesButton';

export class SourceDetails extends React.PureComponent<WithSource & RouteComponentProps<any>> {
  render() {
    const { source, sourceId, match, location } = this.props;
    return (
      <Switch>

        <Route strict path={`${match.path}/gauges/`} component={GaugesRoute} />

        <Route>
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
                    <Route exact path={`${match.path}/gauges`}>
                      <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
                        <GaugesList />
                      </div>
                    </Route>
                  </Tab>

                </Tabs>
              </div>
            </CardMedia>
            <Switch>

              <Route exact path={`${match.path}/gauges`}>
                <ListAdminFooter>
                  <FlatButton label="Autofill" />
                  <ToggleAllGaugesButton sourceId={sourceId} label="Enable All" enabled={true} />
                  <ToggleAllGaugesButton sourceId={sourceId} label="Disable All" enabled={false} />
                </ListAdminFooter>
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
