import { SectionsStatus } from '@whitewater-guide/clients';
import { Coordinate, Region, Section } from '@whitewater-guide/commons';

export interface ItemProps<T> {
  hasPremiumAccess: boolean;
  swipedId: string;
  item: T;
  onPress: (section: Section) => void;
  onMaximize?: (id: string) => void;
  canNavigate: (coordinates: Coordinate) => boolean;
  forceCloseCnt?: number;
}

export interface ListProps {
  sections: Section[];
  region: Region | null;
  refresh: () => Promise<any>;
  status: SectionsStatus;
}
