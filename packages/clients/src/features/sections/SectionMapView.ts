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
import { Point, Section } from '../../../ww-commons';
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
    props => props.section.loading,
    renderComponent(LoadingIndicator),
  ),
  withPropsOnChange(
    ['section'],
    ({ section }: WithSection) => {
      const node: Section = section.node;
      const pois = [...node.pois];
      const gaugePOI = get(node, 'gauge.location');
      if (gaugePOI) {
        pois.push({ ...gaugePOI, name: `Gauge ${node.gauge!.name}` });
      }
      const contentBounds = node.shape.concat(pois.map(poi => poi.coordinates));
      return {
        initialBounds: null, // Currently state is not saved anywhere
        contentBounds,
        sections: [node],
        selectedSection: node,
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
