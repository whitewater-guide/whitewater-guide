import { SectionsStatus } from '@whitewater-guide/clients';
import { Region, Section } from '@whitewater-guide/commons';

export interface ItemProps<T> {
  hasPremiumAccess: boolean;
  regionPremium: boolean;
  buyRegion: () => void;
  swipedId: string;
  item: T;
  onPress: (section: Section) => void;
  onMaximize?: (id: string) => void;
  forceCloseCnt?: number;
}

export interface ListProps {
  sections: Section[];
  region: Region | null;
  refresh: () => Promise<any>;
  status: SectionsStatus;
}
