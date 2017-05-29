import { branch, compose, mapProps, renderComponent, setDisplayName } from 'recompose';
import { connect } from 'react-redux';
import { selectSection, selectPOI, selectBounds } from './actions';
import { getMapView } from '../maps';
import { sectionsBatchLoader } from '../sections';

export default (Layout, Map, SelectedSection, SelectedPOI, LoadingIndicator) => compose(
  setDisplayName('RegionMapView'),
  branch(
    props => props.regionLoading,
    renderComponent(LoadingIndicator),
    compose(
      sectionsBatchLoader(),
      connect(
        (state, { region }) => state.persistent.regions[region._id],
        (dispatch, { region }) => ({
          onSectionSelected: section => dispatch(selectSection(region._id, section)),
          onPOISelected: poi => dispatch(selectPOI(region._id, poi)),
          onBoundsSelected: bounds => dispatch(selectBounds(region._id, bounds)),
        }),
      ),
      mapProps(({ region, sections, selectedBounds, ...props }) => ({
        ...props,
        bounds: selectedBounds || (region ? region.bounds : []),
        sections: sections.list,
        pois: region ? region.pois : [],
      })),
    ),
  ),
)(getMapView(Layout, Map, SelectedSection, SelectedPOI));
