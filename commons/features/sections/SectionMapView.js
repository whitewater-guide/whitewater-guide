import { branch, compose, withPropsOnChange, renderComponent, setDisplayName } from 'recompose';
import { BoundingBox } from 'geocoordinate';
import { getMapView } from '../maps';

export default (Layout, Map, SelectedSection, SelectedPOI, LoadingIndicator) => compose(
  setDisplayName('SectionMapView'),
  branch(
    props => props.sectionLoading,
    renderComponent(LoadingIndicator),
  ),
  withPropsOnChange(
    ['section'],
    ({ section }) => {
      const bbox = new BoundingBox();
      const pois = [...section.pois, section.putIn, section.takeOut];
      pois.forEach(poi => bbox.pushCoordinate(poi.coordinates[1], poi.coordinates[0]));
      const bounds = {
        sw: [bbox.longitude.min, bbox.latitude.min],
        ne: [bbox.longitude.max, bbox.latitude.max],
      };
      return {
        bounds,
        sections: [],
        selectedSection: section,
        pois,
      };
    },
  ),
)(getMapView(Layout, Map, SelectedSection, SelectedPOI));
