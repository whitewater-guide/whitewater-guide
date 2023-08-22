import {
  ListedSectionFragment,
  SectionDerivedFields,
} from '@whitewater-guide/clients';
import { BannerWithSourceFragment } from '@whitewater-guide/schema';

export interface ItemProps<T> {
  regionPremium?: boolean | null;
  item: T;
  onPress: (section: ListedSectionFragment & SectionDerivedFields) => void;
  testID?: string;
}

export interface SwipeableSectionTipItem {
  __typename: 'SwipeableSectionTipItem';
  id: string;
}

type SectionsListDataOptions =
  | SwipeableSectionTipItem
  | (ListedSectionFragment & SectionDerivedFields)
  | BannerWithSourceFragment;

export type SectionsListDataItem = SectionsListDataOptions & { key: string };
