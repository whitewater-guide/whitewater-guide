import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import {
  RegionsFilterProvider,
  useChunkedQuery,
} from '@whitewater-guide/clients';
import React from 'react';

import { useDeleteMutation } from '../../../apollo';
import { Loading } from '../../../components';
import { EditorLanguagePicker } from '../../../components/language';
import { Card, EditorFooter } from '../../../layout';
import type {
  ListRegionsQuery,
  ListRegionsQueryVariables,
} from './listRegions.generated';
import { ListRegionsDocument } from './listRegions.generated';
import RegionsTable from './RegionsTable';
import { RemoveRegionDocument } from './removeRegion.generated';

export const RegionsList: React.FC = React.memo(() => {
  const { data, loading } = useChunkedQuery<
    ListRegionsQuery,
    ListRegionsQueryVariables
  >(
    ListRegionsDocument,
    {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
    },
    20,
  );
  const removeRegion = useDeleteMutation(RemoveRegionDocument, [
    { query: ListRegionsDocument },
  ]);
  return (
    <RegionsFilterProvider>
      <Card>
        <CardHeader title="Regions list" action={<EditorLanguagePicker />} />
        <CardContent>
          {loading ? (
            <Loading />
          ) : (
            <RegionsTable regions={data?.regions} onRemove={removeRegion} />
          )}
        </CardContent>
        <EditorFooter add adminOnly />
      </Card>
    </RegionsFilterProvider>
  );
});

RegionsList.displayName = 'RegionsList';
