import { useChunkedQuery } from '@whitewater-guide/clients';
import React, { useCallback, useState } from 'react';
import { useRouteMatch } from 'react-router';

import { useDeleteMutation } from '../../../apollo';
import { Loading } from '../../../components';
import ChangeRegionDialog from './ChangeRegionDialog';
import {
  ListRiversDocument,
  ListRiversQuery,
  ListRiversQueryVariables,
} from './listRivers.generated';
import { RemoveRiverDocument } from './removeRiver.generated';
import RiversTable from './RiversTable';
import { RouterParams } from './types';

export const RiversList: React.FC = React.memo(() => {
  const match = useRouteMatch<RouterParams>();

  const [dialogRiverId, setDialogRiverId] = useState<string | null>(null);
  const closeDialog = useCallback(
    () => setDialogRiverId(null),
    [setDialogRiverId],
  );

  const { data, loading } = useChunkedQuery<
    ListRiversQuery,
    ListRiversQueryVariables
  >(
    ListRiversDocument,
    {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      variables: { filter: match.params },
    },
    60,
  );
  const removeRiver = useDeleteMutation(RemoveRiverDocument, [
    { query: ListRiversDocument, variables: { filter: match.params } },
  ]);

  if (loading && !data) {
    return <Loading />;
  }

  return (
    <>
      <ChangeRegionDialog
        riverId={dialogRiverId}
        open={!!dialogRiverId}
        onCancel={closeDialog}
      />
      <RiversTable
        rivers={data?.rivers}
        onRemove={removeRiver}
        onChangeRegion={setDialogRiverId}
      />
    </>
  );
});

RiversList.displayName = 'RiversList';
