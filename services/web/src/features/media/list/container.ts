import {
  queryResultToList,
  withFeatureIds,
  withRegion,
} from '@whitewater-guide/clients';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { withDeleteMutation } from '../../../apollo';
import { withLoading } from '../../../components';
import { THUMB_HEIGHT } from './constants';
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
    graphql<{ sectionId: string }, WithMediaListResult, {}, WithMediaList>(
      SECTIONS_MEDIA,
      {
        alias: 'withSectionMedia',
        options: ({ sectionId }) => ({
          fetchPolicy,
          notifyOnNetworkStatusChange: true,
          variables: { sectionId, thumbHeight: THUMB_HEIGHT },
        }),
        props: (props) => queryResultToList(props, 'mediaBySection'),
      },
    ),
    withDeleteMutation({
      mutation: REMOVE_MEDIA,
      propName: 'removeMedia',
    }),
    withLoading<WithMediaList>(({ mediaBySection }) => mediaBySection.loading),
    withRegion,
  );

export default withSectionMedia;
