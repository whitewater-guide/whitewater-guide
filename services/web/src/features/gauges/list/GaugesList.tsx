import { useStreamingQuery } from '@whitewater-guide/clients';
import { Source } from '@whitewater-guide/commons';
import React, { useMemo } from 'react';
import useRouter from 'use-react-router';
import { useDeleteMutation } from '../../../apollo';
import { Loading } from '../../../components';
import { squashConnection } from '../../../formik/utils';
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
      variables: { sourceId: source.id, page: { limit: 60 } },
    },
    60,
  );
  const removeGauge = useDeleteMutation(REMOVE_GAUGE, [
    { query: LIST_GAUGES, variables: { sourceId: source.id } },
  ]);
  const toggleGauge = useToggleGauge();
  const gauges = useMemo(() => squashConnection(data, 'gauges'), [data]);
  if (loading && gauges.length === 0) {
    return <Loading />;
  }
  return (
    <GaugesTable
      source={source}
      gauges={gauges}
      history={history}
      onToggle={toggleGauge}
      onRemove={removeGauge}
    />
  );
});

GaugesList.displayName = 'GaugesList';
