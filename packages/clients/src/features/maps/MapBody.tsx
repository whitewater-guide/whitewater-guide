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
): React.ComponentType<MapProps & MapProps> => {
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
      // This is MapComponent's responsibility to pass extra SProps
      // to its children which are SectionComponents
      return <SectionComponent key={section.id} {...props as any} />;
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
      // This is MapComponent's responsibility to pass extra PProps
      // to its children which are POIComponent
      return <POIComponent key={poi.id} {...props as any} />;
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
