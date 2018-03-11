export type ResourceType = 'gauge' | 'region' | 'river'  | 'section' | 'source' | 'user' | 'media';
export type ListType = 'gauges' | 'regions' | 'rivers'  | 'sections' | 'sources' | 'users' | 'mediaBySection';

export interface Connection<T> {
  count?: number;
  nodes?: T[];
}
