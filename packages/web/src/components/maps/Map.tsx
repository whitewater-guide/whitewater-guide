import React from 'react';
import { MapComponentProps } from '../../ww-clients/features/maps';
import { arrayToGmaps } from '../../ww-clients/utils';
import { Coordinate } from '../../ww-commons';
import GoogleMap, { InitialPosition } from './GoogleMap';

export class Map extends React.Component<MapComponentProps> {
  initialPosition?: InitialPosition;

  constructor(props: MapComponentProps) {
    super(props);
    const { initialBounds, contentBounds } = props;
    const startingBounds = initialBounds || contentBounds;
    if (startingBounds) {
      const bounds = new google.maps.LatLngBounds();
      startingBounds.forEach((point: Coordinate) => bounds.extend(arrayToGmaps(point)!));
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
