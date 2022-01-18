import {
  ListedSectionFragment,
  RegionDetailsFragment,
  SectionDerivedFields,
  SectionsStatus,
} from '@whitewater-guide/clients';

import { SectionsListDataItem } from '../item';

export interface ListProps {
  sections: Array<ListedSectionFragment & SectionDerivedFields> | null;
  region?: RegionDetailsFragment | null;
  refresh: () => Promise<any>;
  status: SectionsStatus;
}

export interface SubtitleItem {
  __typename: 'SubtitleItem';
  id: string;
}

export type FlatListDataItem = SubtitleItem | SectionsListDataItem;
