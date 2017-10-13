export type ResourceType = 'gauge' | 'measurement' | 'media' | 'point' | 'region' | 'river' | 'script'
  | 'section' | 'source' | 'tag' | 'user';

export interface Connection<T> {
  count?: number;
  nodes?: T[];
}
