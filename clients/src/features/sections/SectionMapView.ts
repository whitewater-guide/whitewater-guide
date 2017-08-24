import { get } from 'lodash';
import { ComponentType } from 'react';
import {
  branch,
  compose,
  renderComponent,
  setDisplayName,
  withHandlers,
  withProps,
  withPropsOnChange,
  withState,
} from 'recompose';
import { Point } from '../../../ww-commons';
import { getMapView, MapLayoutProps, MapProps, SelectedPOIViewProps, SelectedSectionViewProps } from '../maps';
import { WithSection } from './withSection';

export const SectionMapView = (
  Layout: ComponentType<MapLayoutProps>,
  Map: ComponentType<MapProps>,
  SelectedSection: ComponentType<SelectedSectionViewProps>,
  SelectedPOI: ComponentType<SelectedPOIViewProps>,
  LoadingIndicator: ComponentType<any>,
) => compose<MapProps, WithSection>(
  setDisplayName('SectionMapView'),
  branch<WithSection>(
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
  withState('selectedPOIId', 'setSelectedPOIId', null),
  withHandlers({
    onPOISelected: (props: any) => (poi: Point) => props.setSelectedPOIId(poi && poi.id),
    /* tslint:disable-next-line:no-empty */
    onSectionSelected: () => () => {}, // Blank handler so deselect will work
  }),
  withProps({ useSectionShapes: true }),
)(getMapView(Layout, Map, SelectedSection, SelectedPOI));
