import { branch, compose, mapProps, renderComponent, setDisplayName } from 'recompose';
import { getMapView } from '../maps';
import { sectionsBatchLoader } from '../sections';

export default (Layout, Map, SelectedSection, SelectedPOI, LoadingIndicator) => compose(
  setDisplayName('RegionMapView'),
  branch(
    props => props.regionLoading,
    renderComponent(LoadingIndicator),
    compose(
      sectionsBatchLoader,
      mapProps(({ region, sections, ...props }) => ({
        ...props,
        bounds: region ? region.bounds : [],
        sections: sections.list,
        pois: region ? region.pois : [],
      })),
    ),
  ),
)(getMapView(Layout, Map, SelectedSection, SelectedPOI));
