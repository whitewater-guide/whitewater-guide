import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import {
  RegionsFilterProvider,
  useStreamingQuery,
} from '@whitewater-guide/clients';
import React, { useMemo } from 'react';

import { useDeleteMutation } from '../../../apollo';
import { Loading } from '../../../components';
import { EditorLanguagePicker } from '../../../components/language';
import { Card, EditorFooter } from '../../../layout';
import { LIST_REGIONS, QResult, QVars } from './listRegions.query';
import RegionsTable from './RegionsTable';
import { REMOVE_REGION } from './removeRegion.mutation';

export const RegionsList: React.FC = React.memo(() => {
  const { data, loading } = useStreamingQuery<QResult, QVars>(
    LIST_REGIONS,
    {
      fetchPolicy: 'cache-and-network',
    },
    20,
  );
  const removeRegion = useDeleteMutation(REMOVE_REGION, [
    { query: LIST_REGIONS },
  ]);
  const regions = useMemo(
    () =>
      data ? data.regions : { __typename: 'RegionsList', nodes: [], count: 0 },
    [data],
  );
  return (
    <RegionsFilterProvider>
      <Card>
        <CardHeader title="Regions list" action={<EditorLanguagePicker />} />
        <CardContent>
          {loading ? (
            <Loading />
          ) : (
            <RegionsTable regions={regions} onRemove={removeRegion} />
          )}
        </CardContent>
        <EditorFooter add={true} adminOnly={true} />
      </Card>
    </RegionsFilterProvider>
  );
});

RegionsList.displayName = 'RegionsList';
