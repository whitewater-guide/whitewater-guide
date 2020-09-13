import { useStreamingQuery } from '@whitewater-guide/clients';
import React, { useCallback, useMemo, useState } from 'react';
import useRouter from 'use-react-router';

import { useDeleteMutation } from '../../../apollo';
import { Loading } from '../../../components';
import { squashConnection } from '../../../formik/utils';
import ChangeRegionDialog from './ChangeRegionDialog';
import { LIST_RIVERS, QResult, QVars } from './listRivers.query';
import { REMOVE_RIVER } from './removeRiver.mutation';
import RiversTable from './RiversTable';
import { RouterParams } from './types';

export const RiversList: React.FC = React.memo(() => {
  const { match } = useRouter<RouterParams>();

  const [dialogRiverId, setDialogRiverId] = useState<string | null>(null);
  const closeDialog = useCallback(() => setDialogRiverId(null), [
    setDialogRiverId,
  ]);

  const { data, loading } = useStreamingQuery<QResult, QVars>(
    LIST_RIVERS,
    {
      fetchPolicy: 'cache-and-network',
      variables: { filter: match.params },
    },
    60,
  );
  const removeRiver = useDeleteMutation(REMOVE_RIVER, [
    { query: LIST_RIVERS, variables: { filter: match.params } },
  ]);

  if (loading && !data) {
    return <Loading />;
  }

  return (
    <React.Fragment>
      <ChangeRegionDialog
        riverId={dialogRiverId}
        dialogOpen={!!dialogRiverId}
        handleCancel={closeDialog}
      />
      <RiversTable
        rivers={data && data.rivers}
        onRemove={removeRiver}
        onChangeRegion={setDialogRiverId}
      />
    </React.Fragment>
  );
});

RiversList.displayName = 'RiversList';
