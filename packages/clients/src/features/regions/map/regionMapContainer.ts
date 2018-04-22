import { connect } from 'react-redux';
import { compose, mapProps } from 'recompose';
import { Point, Section } from '../../../../ww-commons';
import { MapProps } from '../../maps';
import { selectBounds, selectPOI, selectSection } from '../actions';
import { RegionState } from '../reducers';
import { RegionMapProps } from './types';

interface DispatchProps {
  onSectionSelected: (section: Section) => void;
  onPOISelected: (poi: Point) => void;
  onBoundsSelected: (bounds: number[][]) => void;
}

type TMapOuter = RegionState & DispatchProps & RegionMapProps;

export const regionMapContainer = compose<MapProps, RegionMapProps>(
  connect<RegionState, DispatchProps, RegionMapProps>(
    // TODO: clients package should export common redux state
    (state, { region }: RegionMapProps) => (state as any).regions[region.id],
    (dispatch, { region }: RegionMapProps) => ({
      onSectionSelected: (section) => {
        dispatch(selectPOI({ regionId: region.id, poi: null }));
        dispatch(selectSection({ regionId: region.id, section }));
      },
      onPOISelected: (poi) => {
        dispatch(selectPOI({ regionId: region.id, poi }));
        dispatch(selectSection({ regionId: region.id, section: null }));
      },
      onBoundsSelected: bounds => dispatch(selectBounds({ regionId: region.id, bounds })),
    }),
  ),
  mapProps<MapProps, TMapOuter>(({ region, sections, selectedBounds, ...props }) => ({
    ...props,
    useSectionShapes: false,
    initialBounds: selectedBounds || (region ? region.bounds : null),
    contentBounds: region ? region.bounds : null,
    sections,
    pois: region.pois,
  })),
);
