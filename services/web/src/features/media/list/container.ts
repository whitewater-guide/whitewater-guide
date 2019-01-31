import {
  consumeRegion,
  queryResultToList,
  withFeatureIds,
} from '@whitewater-guide/clients';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { withDeleteMutation } from '../../../apollo';
import { withLoading } from '../../../components';
import REMOVE_MEDIA from './removeMedia.mutation';
import SECTIONS_MEDIA from './sectionsMedia.query';
import {
  MediaListProps,
  WithMediaList,
  WithMediaListOptions,
  WithMediaListResult,
} from './types';

export const withSectionMedia = ({
  fetchPolicy = 'cache-and-network',
}: WithMediaListOptions = {}) =>
  compose<MediaListProps, {}>(
    withRouter,
    withFeatureIds('section'),
    graphql<{}, WithMediaListResult, {}, WithMediaList>(SECTIONS_MEDIA, {
      alias: 'withSectionMedia',
      options: () => ({
        fetchPolicy,
        notifyOnNetworkStatusChange: true,
      }),
      props: (props) => queryResultToList(props, 'mediaBySection'),
    }),
    withDeleteMutation({
      mutation: REMOVE_MEDIA,
      propName: 'removeMedia',
    }),
    withLoading<WithMediaList>(({ mediaBySection }) => mediaBySection.loading),
    consumeRegion(),
  );

export default withSectionMedia;