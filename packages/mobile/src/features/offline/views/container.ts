import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { RootState } from '../../../core/reducers';
import { offlineContentActions } from '../actions';
import {
  REGION_MEDIA_SUMMARY,
  Result,
  Vars,
} from '../regionMediaSummary.query';
import { OfflineCategorySelection } from '../types';
import { DispatchProps, GraphqlProps, InnerProps, StateProps } from './types';

const mapStateToProps = ({
  offlineContent,
  network,
}: RootState): StateProps => ({
  region: offlineContent.dialogRegion,
  inProgress:
    !!offlineContent.dialogRegion &&
    offlineContent.dialogRegion.id === offlineContent.regionInProgress,
  progress: offlineContent.progress,
  isConnected: network.isConnected,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  onDismiss: () => dispatch(offlineContentActions.toggleDialog(null)),
  onDownload: (selection: OfflineCategorySelection) =>
    dispatch(offlineContentActions.startDownload(selection)),
});

const container = compose<InnerProps, {}>(
  connect<StateProps, DispatchProps, {}, RootState>(
    mapStateToProps,
    mapDispatchToProps,
  ),
  graphql<StateProps & DispatchProps, Result, Vars, GraphqlProps>(
    REGION_MEDIA_SUMMARY,
    {
      options: (props) => ({
        variables: { regionId: props.region ? props.region.id : undefined },
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      }),
      props: ({ data }) => {
        return {
          summary: {
            summary: data!.region && data!.region!.mediaSummary,
            loading: data!.loading,
            error: data!.error,
            refetch: data!.refetch,
          },
        };
      },
    },
  ),
);

export default container;
