import noop from 'lodash/noop';
import React from 'react';
import { Query } from 'react-apollo';
import { Dialog } from 'react-native-paper';
import { useSelector } from 'react-redux';
import {
  REGION_MEDIA_SUMMARY,
  Result,
  Vars,
} from '../regionMediaSummary.query';
import { offlineContentSelectors } from '../selectors';
import OfflineContentDialogView from './OfflineContentDialogView';

const OfflineContentDialog: React.FC = () => {
  const { region, progress, inProgress, error, variables } = useSelector(
    offlineContentSelectors.dialogState,
  );

  return (
    <Dialog dismissable={false} onDismiss={noop} visible={!!region}>
      <Query<Result, Vars>
        query={REGION_MEDIA_SUMMARY}
        variables={variables}
        fetchPolicy="cache-and-network"
      >
        {({ data, error: summaryError, loading, refetch }) => {
          return (
            <OfflineContentDialogView
              region={region}
              inProgress={inProgress}
              progress={progress}
              error={error}
              summary={{
                summary: data && data.region && data!.region!.mediaSummary,
                loading,
                error: summaryError,
                refetch,
              }}
            />
          );
        }}
      </Query>
    </Dialog>
  );
};

OfflineContentDialog.displayName = 'OfflineContentDialog';

export default OfflineContentDialog;
