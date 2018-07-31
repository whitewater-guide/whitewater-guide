import { NavigationScreenProps } from 'react-navigation';
import { WithNode } from '../../ww-clients/apollo';
import { RegionContext } from '../../ww-clients/features/regions';
import { Region, Section } from '../../ww-commons';

export interface ScreenProps {
  region: WithNode<Region | null>;
  sections: Section[];
  updateSections: () => Promise<any>;
  sectionsStatus: SectionsStatus;
}

export interface NavParams {
  regionId: string;
}

export enum SectionsStatus {
  LOADING,
  LOADING_UPDATES,
  READY,
}

export type OuterProps = NavigationScreenProps<NavParams> & Pick<RegionContext, 'region' | 'searchTerms'>;

export interface InnerProps {
  sections: Section[];
  count: number;
  status: SectionsStatus;
  refresh: () => Promise<void>;
}
