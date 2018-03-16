import { FetchPolicy } from 'apollo-client';
import { RouteComponentProps } from 'react-router';
import { WithDeleteMutation } from '../../../apollo';
import { WithList } from '../../../ww-clients/apollo';
import { WithMe } from '../../../ww-clients/features/users';
import { Connection, Media } from '../../../ww-commons';

export interface WithMediaListOptions {
  fetchPolicy?: FetchPolicy;
}

export interface WithMediaListResult {
  media: Connection<Media>;
}

export interface WithMediaList {
  mediaBySection: WithList<Media>;
}

export type MediaListProps =
  WithMediaList &
  WithMe &
  WithDeleteMutation<'removeMedia'> &
  RouteComponentProps<{regionId: string, sectionId: string}>;
