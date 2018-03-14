import { FetchPolicy } from 'apollo-client';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { queryResultToList, WithList } from '../../../ww-clients/apollo';
import { withFeatureIds } from '../../../ww-clients/core';
import { Connection, Media } from '../../../ww-commons';
import SECTIONS_MEDIA from './sectionsMedia.query';

export interface WithMediaListOptions {
  fetchPolicy?: FetchPolicy;
}

export interface WithMediaListResult {
  media: Connection<Media>;
}

export interface WithMediaList {
  mediaBySection: WithList<Media>;
}

export const withSectionMedia = ({ fetchPolicy = 'cache-and-network' }: WithMediaListOptions = {}) =>
  compose<WithMediaList, {}>(
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
  );

export default withSectionMedia;
