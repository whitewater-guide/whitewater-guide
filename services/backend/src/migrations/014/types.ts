import { Coordinate2d } from '@whitewater-guide/commons';

export interface RzRoot {
  elapsedMs: number;
  sections: RzSection[];
  licensingTerms: string;
}

export interface RzSection {
  id: string;
  revision: number;
  lastUpdatedTs: number;
  countryCode: string;
  state: string;
  riverName: string;
  sectionName: string;
  ordinal: number;
  category: string;
  descriptionUrl?: string | null;
  putInLatLng?: Coordinate2d | null;
  takeOutLatLng?: Coordinate2d | null;
  grade: string;
  gauge: RzGauge;
  news: RzText;
  pois: RzPoi[];
  polys: RzPoly[];
  gaugesAlt: RzGauge[];
  lengthMt: number;
  durationMin: number;
}

export interface RzGauge {
  id: string;
  unit: string;
  min?: number | null;
  med?: number | null;
  max?: number | null;
  lastUpdatedTs: number;
  indirect: boolean;
  notes: RzText;
}

export interface RzText {
  it?: string | null;
}

export interface RzPoi {
  type: string;
  latlng?: Coordinate2d | null;
  notes?: RzText | null;
}

export interface RzPoly {
  grade: string;
  poly?: Array<Coordinate2d | null> | null;
}

export const POITypesMap = new Map([
  ['takeOutAlt', 'take-out-alt'],
  ['parking', 'other'],
  ['info', 'other'],
  ['weir', 'hazard'],
  ['putInAlt', 'put-in-alt'],
  ['danger', 'hazard'],
  ['portage', 'portage'],
  ['death', 'hazard'],
  ['webcam', 'other'],
  ['food', 'other'],
  ['gaugeAlt', 'gauge'],
]);
