import React from 'react';
import { useQuery } from 'react-apollo';
import { RouteComponentProps } from 'react-router';

import { Loading, NotFound } from '../../../components';
import { Card } from '../../../layout';
import GaugeCard from './GaugeCard';
import { GAUGE_DETAILS, QResult, QVars } from './gaugeDetails.query';
import { RouterParams } from './types';

export const GaugeDetails: React.FC<RouteComponentProps<
  RouterParams
>> = React.memo((props) => {
  const {
    match: {
      params: { gaugeId },
    },
  } = props;
  const { data, loading } = useQuery<QResult, QVars>(GAUGE_DETAILS, {
    fetchPolicy: 'cache-and-network',
    variables: { gaugeId },
  });
  if (loading) {
    return <Loading />;
  }
  const gauge = data && data.gauge;
  if (!gauge) {
    return (
      <Card>
        <NotFound resource="gauge" id={gaugeId} />
      </Card>
    );
  }
  return <GaugeCard gauge={gauge} />;
});

GaugeDetails.displayName = 'GaugeDetails';