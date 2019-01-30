export type ResourceType =
  | 'gauge'
  | 'region'
  | 'river'
  | 'section'
  | 'source'
  | 'user'
  | 'media'
  | 'group'
  | 'banner';
export type ListType =
  | 'gauges'
  | 'regions'
  | 'rivers'
  | 'sections'
  | 'sources'
  | 'users'
  | 'mediaBySection'
  | 'groups'
  | 'banners';

export interface Connection<T> {
  __typename?: string;
  count?: number;
  nodes?: T[];
}
