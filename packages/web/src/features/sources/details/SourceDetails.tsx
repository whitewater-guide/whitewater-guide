import { CardMedia } from 'material-ui/Card';
import { Tab } from 'material-ui/Tabs';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { Content, Tabs } from '../../../components';
import { AdminFooter } from '../../../layout';
import { WithSource } from '../../../ww-clients/features/sources';
import { GaugesList, GaugesRoute } from '../../gauges';
import AutofillButton from './AutofillButton';
import GenerateScheduleButton from './GenerateScheduleButton';
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
                        <GaugesList source={source.node} />
                      </div>
                    </Route>
                  </Tab>

                </Tabs>
              </div>
            </CardMedia>
            <Switch>

              <Route exact path={`${match.path}/gauges`}>
                <AdminFooter add>
                  <AutofillButton sourceId={sourceId} secondary label="Autofill" />
                  <GenerateScheduleButton sourceId={sourceId} secondary label="Generate schedule" />
                  <ToggleAllGaugesButton sourceId={sourceId} label="Enable All" enabled />
                  <ToggleAllGaugesButton sourceId={sourceId} label="Disable All" enabled={false} />
                </AdminFooter>
              </Route>

              <Route>
                <AdminFooter edit/>
              </Route>

            </Switch>
          </Content>
        </Route>
      </Switch>
    );
  }
}
