export type ResourceType = 'gauge' | 'region' | 'river' | 'section' | 'source' | 'user' | 'media' | 'group';
export type ListType = 'gauges' | 'regions' | 'rivers' | 'sections' | 'sources' | 'users' | 'mediaBySection' | 'groups';

export interface Connection<T> {
  __typename?: string;
  count?: number;
  nodes?: T[];
}
