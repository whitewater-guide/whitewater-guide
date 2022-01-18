import {
  ListedSectionFragment,
  RegionDetailsFragment,
  SectionDerivedFields,
  SectionsStatus,
} from '@whitewater-guide/clients';

export interface ListProps {
  sections: Array<ListedSectionFragment & SectionDerivedFields> | null;
  region?: RegionDetailsFragment | null;
  refresh: () => Promise<any>;
  status: SectionsStatus;
}
