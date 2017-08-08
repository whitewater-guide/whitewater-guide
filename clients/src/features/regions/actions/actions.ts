import { actionCreatorFactory } from 'typescript-fsa';
import { Point, Section, SectionSearchTerms } from '../../../ww-commons';

const factory = actionCreatorFactory('REGION');

interface RegionActionPayload {
  regionId: string | null;
}

export const selectRegion = factory<RegionActionPayload>('SELECT');
export const updateSearchTerms = factory<RegionActionPayload & { searchTerms: SectionSearchTerms }>('UPDATE_SEARCH_TERMS');
export const resetSearchTerms = factory<RegionActionPayload>('RESET_SEARCH_TERMS');
export const selectSection = factory<RegionActionPayload & { section: Section | null }>('SELECT_SECTION');
export const selectPOI = factory<RegionActionPayload & { poi: Point | null }>('SELECT_POI');
export const selectBounds = factory<RegionActionPayload & { bounds: number[][] }>('SELECT_BOUNDS');
