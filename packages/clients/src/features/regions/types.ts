import { Coordinate, Point, Region, Section, SectionSearchTerms } from '../../../ww-commons';
import { WithNode } from '../../apollo';

export interface WithRegion {
  region: WithNode<Region | null>;
}

export interface RegionState {
  selectedSectionId: string | null;
  selectedPOIId: string | null;
  searchTerms: SectionSearchTerms;
  selectedBounds: Coordinate[] | null;
}

export interface RegionActions {
  onSectionSelected: (section: Section | null) => void;
  onPOISelected: (poi: Point | null) => void;
  resetSearchTerms: () => void;
  setSearchTerms: (searchTerms: SectionSearchTerms) => void;
}

export type RegionContext = RegionState & RegionActions & WithRegion;
