import { useStreamingQuery } from '@whitewater-guide/clients';
import { Source } from '@whitewater-guide/commons';
import React from 'react';
import useRouter from 'use-react-router';
import { useDeleteMutation } from '../../../apollo';
import { Loading } from '../../../components';
import GaugesTable from './GaugesTable';
import { LIST_GAUGES, QResult, QVars } from './listGauges.query';
import { REMOVE_GAUGE } from './removeGauge.mutation';
import useToggleGauge from './useToggleGauge';

interface Props {
  source: Source;
}

export const GaugesList: React.FC<Props> = React.memo((props) => {
  const { source } = props;
  const { history } = useRouter();
  const { data, loading } = useStreamingQuery<QResult, QVars>(
    LIST_GAUGES,
    {
      fetchPolicy: 'cache-and-network',
      variables: { filter: { sourceId: source.id } },
    },
    60,
  );
  const removeGauge = useDeleteMutation(REMOVE_GAUGE, [
    { query: LIST_GAUGES, variables: { sourceId: source.id } },
  ]);
  const toggleGauge = useToggleGauge();
  if (loading && !data) {
    return <Loading />;
  }
  return (
    <GaugesTable
      source={source}
      gauges={data && data.gauges}
      history={history}
      onToggle={toggleGauge}
      onRemove={removeGauge}
    />
  );
});

GaugesList.displayName = 'GaugesList';