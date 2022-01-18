import { Duration } from '@whitewater-guide/schema';

export type FlowFormula = (x?: number | null) => number | null;

export interface Formulas {
  levels: FlowFormula;
  flows: FlowFormula;
}

export enum SectionsStatus {
  LOADING,
  LOADING_UPDATES,
  READY,
}

export type SectionSortBy = 'name' | 'difficulty' | 'duration' | 'rating';

/**
 * Client-side filter options
 * */
export interface SectionFilterOptions {
  searchString?: string | null;
  sortBy: SectionSortBy;
  sortDirection: 'ASC' | 'DESC';
  difficulty: [number, number];
  duration: [Duration, Duration];
  rating: number;
  seasonNumeric: [number, number];
  withTags: string[];
  withoutTags: string[];
}

export const DefaultSectionFilterOptions: SectionFilterOptions = {
  sortBy: 'name',
  sortDirection: 'ASC',
  searchString: '',
  difficulty: [0, 6],
  duration: [Duration.LAPS, Duration.MULTIDAY],
  rating: 0,
  seasonNumeric: [0, 23],
  withTags: [],
  withoutTags: [],
};

export interface SectionDerivedFields {
  flowsThumb?: {
    color: string;
    unit: string;
    value: string;
    fromNow: string;
  };
}
