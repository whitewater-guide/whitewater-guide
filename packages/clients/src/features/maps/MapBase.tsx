import * as React from 'react';
import { Point, Section } from '../../../ww-commons';
import { MapComponentProps, MapProps, POIComponentProps, SectionComponentProps } from './types';

interface State {
  zoom: number;
}

export default (
  MapComponent: React.ComponentType<MapComponentProps>,
  SectionComponent: React.ComponentType<SectionComponentProps>,
  POIComponent: React.ComponentType<POIComponentProps>,
) => {
  class MapBase extends React.PureComponent<MapProps, State> {

    state: State = {
      zoom: 1,
    };

    onZoom = (zoom: number) => this.setState({ zoom });

    renderSection = (section: Section) => {
      const { onSectionSelected, selectedSectionId, useSectionShapes } = this.props;
      const { zoom } = this.state;
      return (
        <SectionComponent
          useSectionShapes={useSectionShapes}
          key={section.id}
          section={section}
          selected={selectedSectionId === section.id}
          onSectionSelected={onSectionSelected}
          zoom={zoom}
        />
      );
    };

    renderPOI = (poi: Point) => {
      const { onPOISelected, selectedPOIId } = this.props;
      const { zoom } = this.state;
      return (
        <POIComponent
          key={poi.id}
          poi={poi}
          selected={selectedPOIId === poi.id}
          onPOISelected={onPOISelected}
          zoom={zoom}
        />
      );
    };

    render() {
      const { sections, pois, ...props } = this.props;
      return (
        <MapComponent onZoom={this.onZoom} {...props}>
          {sections.map(this.renderSection)}
          {pois.map(this.renderPOI)}
        </MapComponent>
      );
    }
  }

  return MapBase;
};