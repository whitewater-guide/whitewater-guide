export type ResourceType = 'gauge' | 'region' | 'river'  | 'section' | 'source' | 'user';
export type ListType = 'gauges' | 'regions' | 'rivers'  | 'sections' | 'sources' | 'users';

export interface Connection<T> {
  count?: number;
  nodes?: T[];
}
