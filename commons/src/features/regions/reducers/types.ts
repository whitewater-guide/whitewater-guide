import { SectionSearchTerms } from '../../sections';

export interface RegionState {
  selectedBounds: number[][] | null;
  selectedSectionId: string | null;
  selectedPOIId: string | null;
  searchTerms: SectionSearchTerms;
}

export interface RegionsState {
  [regionId: string]: RegionState;
}
