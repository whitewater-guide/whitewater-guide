import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import { PrivateRoute } from '../../layout';
import GaugeForm from './form';
import GaugesList from './list';

type Props = RouteComponentProps<{sourceId?: string}>;

export const GaugesRoute: React.StatelessComponent<Props> = ({ match }) => [
  <Route key="list" exact path={`${match.url}/gauges`} component={GaugesList} />,
  match.params.sourceId && <PrivateRoute key="new" exact path={`${match.url}/gauges/new`} component={GaugeForm} />,
  <PrivateRoute key="settings" exact path={`${match.url}/gauges/:gaugeId/settings`} component={GaugeForm} />,
] as any;
