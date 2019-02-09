import { arrayToGmaps, MapComponentProps } from '@whitewater-guide/clients';
import { Coordinate } from '@whitewater-guide/commons';
import React from 'react';
import GoogleMap, { InitialPosition } from './GoogleMap';

export class Map extends React.Component<MapComponentProps> {
  initialPosition?: InitialPosition;

  constructor(props: MapComponentProps) {
    super(props);
    const { initialBounds, contentBounds } = props;
    const startingBounds = initialBounds || contentBounds;
    if (startingBounds) {
      const bounds = new google.maps.LatLngBounds();
      startingBounds.forEach((point: Coordinate) =>
        bounds.extend(arrayToGmaps(point)!),
      );
      this.initialPosition = {
        center: bounds.getCenter(),
        bounds,
        zoom: -1,
      };
    }
  }

  render() {
    return (
      <GoogleMap initialPosition={this.initialPosition}>
        {this.props.children}
      </GoogleMap>
    );
  }
}
