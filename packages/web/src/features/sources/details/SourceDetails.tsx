import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';

import { Loading } from '../../../components';
import { GaugesRoute } from '../../gauges';
import SourceCard from './SourceCard';
import { useSourceDetailsQuery } from './sourceDetails.generated';

type Props = RouteComponentProps<{ sourceId: string }>;

export const SourceDetails = React.memo<Props>((props) => {
  const { match } = props;
  const { sourceId } = match.params;
  const { data, loading } = useSourceDetailsQuery({
    fetchPolicy: 'cache-and-network',
    variables: { sourceId },
  });
  if (loading && !data) {
    return <Loading />;
  }
  const source = data?.source || null;
  return (
    <Switch>
      <Route strict path={`${match.path}/gauges/`} component={GaugesRoute} />

      <Route>
        <SourceCard sourceId={sourceId} source={source} path={match.path} />
      </Route>
    </Switch>
  );
});

SourceDetails.displayName = 'SourceDetails';
