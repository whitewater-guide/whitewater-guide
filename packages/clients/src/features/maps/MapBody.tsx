import React from 'react';
import { Point, Section } from '../../../ww-commons';
import { MapBodyState, MapComponentProps, MapProps, POIComponentProps, SectionComponentProps } from './types';

export const MapBody = <
  MProps extends MapComponentProps = MapComponentProps,
  SProps extends SectionComponentProps = SectionComponentProps,
  PProps extends POIComponentProps = POIComponentProps
>(
  MapComponent: React.ComponentType<MProps>,
  SectionComponent: React.ComponentType<SProps>,
  POIComponent: React.ComponentType<PProps>,
) => {
  class MapBodyInternal extends React.PureComponent<MapProps, MapBodyState> {
    // tslint:disable-next-line:no-inferrable-types
    static displayName: string = 'MapBody';

    state: MapBodyState = {
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
      const { children, sections, pois, ...props } = this.props;
      return (
        <MapComponent onZoom={this.onZoom} {...props}>
          {sections.map(this.renderSection)}
          {pois.map(this.renderPOI)}
          {children}
        </MapComponent>
      );
    }
  }

  return MapBodyInternal;
};
