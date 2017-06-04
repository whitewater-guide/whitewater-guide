import { branch, compose, withPropsOnChange, renderComponent, setDisplayName, withProps, withState, withHandlers } from 'recompose';
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
      const bounds = section.shape;
      return {
        bounds,
        sections: [section],
        selectedSection: section,
        pois,
      };
    },
  ),
  withState('selectedPOIId', 'setSelectedPOIId'),
  withHandlers({
    onPOISelected: props => poi => props.setSelectedPOIId(poi && poi._id),
  }),
  withProps({ useSectionShapes: true }),
)(getMapView(Layout, Map, SelectedSection, SelectedPOI));
