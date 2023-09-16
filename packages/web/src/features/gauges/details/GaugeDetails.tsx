import React from 'react';
import type { RouteComponentProps } from 'react-router';

import { Loading, NotFound } from '../../../components';
import { Card } from '../../../layout';
import GaugeCard from './GaugeCard';
import { useGaugeDetailsQuery } from './gaugeDetails.generated';
import type { RouterParams } from './types';

export const GaugeDetails: React.FC<RouteComponentProps<RouterParams>> =
  React.memo((props) => {
    const {
      match: {
        params: { gaugeId },
      },
    } = props;
    const { data, loading } = useGaugeDetailsQuery({
      fetchPolicy: 'cache-and-network',
      variables: { gaugeId },
    });
    if (loading) {
      return <Loading />;
    }
    const gauge = data?.gauge;
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
