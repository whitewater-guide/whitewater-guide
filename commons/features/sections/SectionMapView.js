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
      return {
        initialBounds: null, // Currently state is not saved anywhere
        contentBounds: section.shape,
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
