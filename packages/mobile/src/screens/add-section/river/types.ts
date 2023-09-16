import type { River } from '@whitewater-guide/schema';

export interface AddNewRiverItem {
  __typename: 'AddNewRiverItem';
  id: string;
  name: string;
}

export interface LoadingItem {
  __typename: 'Loading';
  id: string;
}

export interface NotFoundItem {
  __typename: 'NotFound';
  id: string;
}

export type RiversListDataItem =
  | Pick<River, '__typename' | 'id' | 'name'>
  | AddNewRiverItem
  | LoadingItem
  | NotFoundItem;
