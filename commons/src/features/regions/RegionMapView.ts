import { ComponentType } from 'react';
import { connect } from 'react-redux';
import { branch, compose, mapProps, renderComponent, setDisplayName } from 'recompose';
import { getMapView, MapLayoutProps, MapProps, SelectedPOIViewProps, SelectedSectionViewProps } from '../maps';
import { Point } from '../points';
import { Section, sectionsBatchLoader } from '../sections';
import { selectBounds, selectPOI, selectSection } from './actions';
import { RegionState } from './reducers';
import { WithRegion } from './withRegion';

interface DispatchProps {
  onSectionSelected: (section: Section) => void;
  onPOISelected: (poi: Point) => void;
  onBoundsSelected: (bounds: number[][]) => void;
}

interface RegionMapProps extends MapProps {
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
    props => props.regionLoading,
    renderComponent(LoadingIndicator),
    compose(
      sectionsBatchLoader(),
      connect<RegionState, DispatchProps, WithRegion>(
        (state, { region }: WithRegion) => state.persistent.regions[region!.id],
        (dispatch, { region }: WithRegion) => ({
          onSectionSelected: section => dispatch(selectSection({ regionId: region!.id, section })),
          onPOISelected: poi => dispatch(selectPOI({ regionId: region!.id, poi })),
          onBoundsSelected: bounds => dispatch(selectBounds({ regionId: region!.id, bounds })),
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
