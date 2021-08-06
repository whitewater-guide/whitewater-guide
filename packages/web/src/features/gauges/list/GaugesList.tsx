import { useStreamingQuery } from '@whitewater-guide/clients';
import { Node } from '@whitewater-guide/schema';
import React from 'react';
import useRouter from 'use-react-router';

import { useDeleteMutation } from '../../../apollo';
import { Loading } from '../../../components';
import GaugesTable from './GaugesTable';
import {
  ListGaugesDocument,
  ListGaugesQuery,
  ListGaugesQueryVariables,
} from './listGauges.generated';
import { RemoveGaugeDocument } from './removeGauge.generated';

interface Props {
  source: Node;
}

export const GaugesList = React.memo<Props>((props) => {
  const { source } = props;
  const { history } = useRouter();
  const { data, loading } = useStreamingQuery<
    ListGaugesQuery,
    ListGaugesQueryVariables
  >(
    ListGaugesDocument,
    {
      fetchPolicy: 'cache-and-network',
      variables: { filter: { sourceId: source.id } },
    },
    60,
  );
  const removeGauge = useDeleteMutation(RemoveGaugeDocument, [
    { query: ListGaugesDocument, variables: { sourceId: source.id } },
  ]);
  if (loading && !data) {
    return <Loading />;
  }
  return (
    <GaugesTable
      source={source}
      gauges={data?.gauges}
      history={history}
      onRemove={removeGauge}
    />
  );
});

GaugesList.displayName = 'GaugesList';
