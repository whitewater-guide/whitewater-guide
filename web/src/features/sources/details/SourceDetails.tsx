import { CardActions, CardHeader, CardMedia } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { Tab } from 'material-ui/Tabs';
import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import { Content, Tabs } from '../../../components';
import { WithSource } from '../../../ww-clients/features/sources';
import { GaugesList } from '../../gauges';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import SourceDetailsMain from './SourceDetailsMain';
import { GaugesRoute } from '../../gauges';
import ListAdminFooter from '../../../layout/list/ListAdminFooter';

export class SourceDetails extends React.PureComponent<WithSource & RouteComponentProps<any>> {
  render() {
    const { source, sourceId, match } = this.props;
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
            <Route exact path={`${match.path}/gauges`}>
              <CardActions>
                <ListAdminFooter>
                  <FlatButton label="Autofill" />
                </ListAdminFooter>
              </CardActions>
            </Route>
          </Content>
        </Route>
      </Switch>
    );
  }
}
