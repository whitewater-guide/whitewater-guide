import { FetchPolicy } from 'apollo-client';
import { RouteComponentProps } from 'react-router';
import { WithList } from '../../../ww-clients/apollo';
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

export type MediaListProps = WithMediaList & RouteComponentProps<{regionId: string, sectionId: string}>;
