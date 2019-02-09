import { Point, Section } from '@whitewater-guide/commons';
import React from 'react';
import {
  MapBodyState,
  MapComponentProps,
  MapProps,
  POIComponentProps,
  SectionComponentProps,
} from './types';

export const MapBody = <
  MProps extends {} = {},
  SProps extends {} = {},
  PProps extends {} = {}
>(
  MapComponent: React.ComponentType<MapComponentProps & MProps>,
  SectionComponent: React.ComponentType<SectionComponentProps & SProps>,
  POIComponent: React.ComponentType<POIComponentProps & PProps>,
  passExtraSectionProps: (props: MapProps & MProps) => SProps,
  passExtraPOIProps: (props: MapProps & MProps) => PProps,
): React.ComponentType<MapProps & MProps> => {
  class MapBodyInternal extends React.PureComponent<
    MapProps & MProps,
    MapBodyState
  > {
    // tslint:disable-next-line:no-inferrable-types
    static displayName: string = 'MapBody';

    readonly state: MapBodyState = {
      zoom: 1,
    };

    onZoom = (zoom: number) => this.setState({ zoom });

    renderSection = (section: Section) => {
      const {
        onSectionSelected,
        selectedSectionId,
        useSectionShapes,
      } = this.props;
      const { zoom } = this.state;
      const props: SectionComponentProps = {
        useSectionShapes,
        section,
        selected: selectedSectionId === section.id,
        onSectionSelected,
        zoom,
      };
      const extraProps = passExtraSectionProps(this.props);
      return <SectionComponent key={section.id} {...props} {...extraProps} />;
    };

    renderPOI = (poi: Point) => {
      const { onPOISelected, selectedPOIId } = this.props;
      const { zoom } = this.state;
      const props: POIComponentProps = {
        poi,
        onPOISelected,
        selected: selectedPOIId === poi.id,
        zoom,
      };
      const extraProps = passExtraPOIProps(this.props);
      return <POIComponent key={poi.id} {...props} {...extraProps} />;
    };

    render() {
      const {
        children,
        sections,
        pois,
        onBoundsSelected,
        ...props
      } = this.props;
      return (
        <MapComponent onZoom={this.onZoom} {...props as any}>
          {sections.map(this.renderSection)}
          {pois.map(this.renderPOI)}
          {children}
        </MapComponent>
      );
    }
  }

  return MapBodyInternal;
};
