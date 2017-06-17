import { branch, compose, withPropsOnChange, renderComponent, setDisplayName, withProps, withState, withHandlers } from 'recompose';
import { get } from 'lodash';
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
      const pois = [...section.pois];
      const gaugePOI = get(section, 'gauge.location');
      if (gaugePOI) {
        pois.push({ ...gaugePOI, name: `Gauge ${section.gauge.name}` });
      }
      const contentBounds = section.shape.concat(pois.map(poi => poi.coordinates));
      return {
        initialBounds: null, // Currently state is not saved anywhere
        contentBounds,
        sections: [section],
        selectedSection: section,
        pois,
      };
    },
  ),
  withState('selectedPOIId', 'setSelectedPOIId'),
  withHandlers({
    onPOISelected: props => poi => props.setSelectedPOIId(poi && poi._id),
    onSectionSelected: () => () => {}, // Blank handler so deselect will work
  }),
  withProps({ useSectionShapes: true }),
)(getMapView(Layout, Map, SelectedSection, SelectedPOI));
