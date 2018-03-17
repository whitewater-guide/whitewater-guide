import { graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { withDeleteMutation } from '../../../apollo';
import { withLoading } from '../../../components';
import { queryResultToList } from '../../../ww-clients/apollo';
import { withFeatureIds } from '../../../ww-clients/core';
import { withMe } from '../../../ww-clients/features/users';
import REMOVE_MEDIA from './removeMedia.mutation';
import SECTIONS_MEDIA from './sectionsMedia.query';
import { MediaListProps, WithMediaList, WithMediaListOptions, WithMediaListResult } from './types';

export const withSectionMedia = ({ fetchPolicy = 'cache-and-network' }: WithMediaListOptions = {}) =>
  compose<MediaListProps, {}>(
    withRouter,
    withFeatureIds('section'),
    graphql<WithMediaListResult, any, WithMediaList>(
      SECTIONS_MEDIA,
      {
        alias: 'withSectionMedia',
        options: {
          fetchPolicy,
          notifyOnNetworkStatusChange: true,
        },
        props: props => queryResultToList(props, 'mediaBySection'),
      },
    ),
    withDeleteMutation({
      mutation: REMOVE_MEDIA,
      propName: 'removeMedia',
    }),
    withLoading<WithMediaList>(({ mediaBySection }) => mediaBySection.loading),
    withMe(),
  );

export default withSectionMedia;