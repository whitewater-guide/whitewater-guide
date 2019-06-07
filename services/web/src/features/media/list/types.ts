import { WithList, WithRegion } from '@whitewater-guide/clients';
import { Connection, Media } from '@whitewater-guide/commons';
import { FetchPolicy, WatchQueryFetchPolicy } from 'apollo-client';
import { RouteComponentProps } from 'react-router';
import { WithDeleteMutation } from '../../../apollo';

export interface WithMediaListOptions {
  fetchPolicy?: WatchQueryFetchPolicy;
}

export interface WithMediaListResult {
  media: Connection<Media>;
}

export interface WithMediaList {
  mediaBySection: WithList<Media>;
}

export type MediaListProps = WithMediaList &
  WithRegion &
  WithDeleteMutation<'removeMedia'> &
  RouteComponentProps<{ regionId: string; sectionId: string }>;
