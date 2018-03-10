import { ComponentType } from 'react';
import { connect } from 'react-redux';
import { branch, compose, mapProps, renderComponent, setDisplayName } from 'recompose';
import { Point, Section } from '../../../ww-commons';
import { getMapView, MapLayoutProps, MapProps, SelectedPOIViewProps, SelectedSectionViewProps } from '../maps';
import { selectBounds, selectPOI, selectSection } from './actions';
import { RegionState } from './reducers';
import { WithRegion } from './withRegion';

interface DispatchProps {
  onSectionSelected: (section: Section) => void;
  onPOISelected: (poi: Point) => void;
  onBoundsSelected: (bounds: number[][]) => void;
}

export interface RegionMapProps extends MapProps {
  onBoundsSelected: (bounds: number[][]) => void;
}

export default (
  Layout: ComponentType<MapLayoutProps>,
  Map: ComponentType<RegionMapProps>,
  SelectedSection: ComponentType<SelectedSectionViewProps>,
  SelectedPOI: ComponentType<SelectedPOIViewProps>,
  LoadingIndicator: ComponentType<any>,
) => compose<RegionMapProps, WithRegion>(
  setDisplayName('RegionMapView'),
  branch<WithRegion>(
    props => props.region.loading,
    renderComponent(LoadingIndicator),
    compose(
      connect<RegionState, DispatchProps, WithRegion>(
        (state, { region }: WithRegion) => (state as any).persistent.regions[region.node.id],
        (dispatch, { regionId }: WithRegion) => ({
          onSectionSelected: section => dispatch(selectSection({ regionId, section })),
          onPOISelected: poi => dispatch(selectPOI({ regionId, poi })),
          onBoundsSelected: bounds => dispatch(selectBounds({ regionId, bounds })),
        }),
      ),
      mapProps(({ region, sections, selectedBounds, ...props }) => ({
        ...props,
        initialBounds: selectedBounds || (region ? region.bounds : null),
        contentBounds: region ? region.bounds : null,
        sections: sections.list,
        pois: region ? region.pois : [],
      })),
    ),
  ),
)(getMapView(Layout, Map, SelectedSection, SelectedPOI));
