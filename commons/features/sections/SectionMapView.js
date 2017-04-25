import { branch, compose, withPropsOnChange, renderComponent, setDisplayName, withProps } from 'recompose';
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
  withProps({ useSectionShapes: true }),
)(getMapView(Layout, Map, SelectedSection, SelectedPOI));
