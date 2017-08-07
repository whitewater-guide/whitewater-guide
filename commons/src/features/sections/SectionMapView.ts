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
import { getMapView, MapLayoutProps, MapProps, SelectedPOIViewProps, SelectedSectionViewProps } from '../maps';
import { Point } from '../points';
import { Section } from './types';
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
    onSectionSelected: () => () => {}, // Blank handler so deselect will work
  }),
  withProps({ useSectionShapes: true }),
)(getMapView(Layout, Map, SelectedSection, SelectedPOI));

// Workaround to make TS emit declarations, see https://github.com/Microsoft/TypeScript/issues/9944
let s: Section;
