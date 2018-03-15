import { graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { withLoading } from '../../../components';
import { queryResultToList } from '../../../ww-clients/apollo';
import { withFeatureIds } from '../../../ww-clients/core';
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
    withLoading<WithMediaList>(({ mediaBySection }) => mediaBySection.loading),
  );

export default withSectionMedia;
