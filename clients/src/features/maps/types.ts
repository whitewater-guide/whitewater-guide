import { ReactElement } from 'react';
import { Point, Section } from '../../ww-commons';

export interface SectionComponentProps {
  useSectionShapes: boolean;
  section: Section;
  selected: boolean;
  onSectionSelected: (section: Section | null) => void;
  zoom: number;
}

export interface POIComponentProps {
  poi: Point;
  selected: boolean;
  onPOISelected: (poi: Point | null) => void;
  zoom: number;
}

export interface MapPropsBase {
  selectedSectionId: string | null;
  onSectionSelected: (section: Section | null) => void;
  selectedPOIId: string | null;
  onPOISelected: (poi: Point | null) => void;
  useSectionShapes: boolean;
}

export interface MapProps extends MapPropsBase {
  initialBounds: number[][] | null;
  contentBounds: number[][] | null;
  sections: Section[];
  pois: Point[];
}

export interface MapComponentProps extends MapPropsBase {
  onZoom: (zoom: number) => void;
}

export interface SelectedSectionViewProps {
  onSectionSelected: (section: Section | null) => void;
  onPOISelected: (point: Point | null) => void;
  selectedSection: Section | null;
}

export interface SelectedPOIViewProps {
  selectedPOI: Point | null;
  onPOISelected: (poi: Point | null) => void;
  selectedSection: Section | null;
}

export interface MapLayoutProps {
  mapView: ReactElement<MapProps>;
  selectedSectionView: ReactElement<SelectedSectionViewProps>;
  selectedPOIView: ReactElement<SelectedPOIViewProps>;
}
