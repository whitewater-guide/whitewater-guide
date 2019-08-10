import React from 'react';
import { useQuery } from 'react-apollo';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { Loading } from '../../../components';
import { GaugesRoute } from '../../gauges';
import SourceCard from './SourceCard';
import { QResult, QVars, SOURCE_DETAILS } from './sourceDetails.query';

type Props = RouteComponentProps<{ sourceId: string }>;

export const SourceDetails: React.FC<Props> = React.memo((props) => {
  const { match } = props;
  const { sourceId } = match.params;
  const { data, loading } = useQuery<QResult, QVars>(SOURCE_DETAILS, {
    fetchPolicy: 'cache-and-network',
    variables: { sourceId },
  });
  if (loading && !data) {
    return <Loading />;
  }
  const source = (data && data.source) || null;
  return (
    <Switch>
      <Route
        strict={true}
        path={`${match.path}/gauges/`}
        component={GaugesRoute}
      />

      <Route>
        <SourceCard sourceId={sourceId} source={source} path={match.path} />
      </Route>
    </Switch>
  );
});

SourceDetails.displayName = 'SourceDetails';
