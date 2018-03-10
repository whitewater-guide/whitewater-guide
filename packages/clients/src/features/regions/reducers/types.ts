import { Coordinate, SectionSearchTerms } from '../../../../ww-commons';

export interface RegionState {
  selectedBounds: Coordinate[] | null;
  selectedSectionId: string | null;
  selectedPOIId: string | null;
  searchTerms: SectionSearchTerms;
}

export interface RegionsState {
  [regionId: string]: RegionState;
}
