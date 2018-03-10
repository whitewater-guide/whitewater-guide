import * as React from 'react';
import { MapComponentProps } from '../../ww-clients/features/maps';
import { arrayToGmaps } from '../../ww-clients/utils';
import { Coordinate } from '../../ww-commons';
import GoogleMap from './GoogleMap';

export class Map extends React.Component<MapComponentProps> {

  onLoaded = (map: google.maps.Map) => {
    const { initialBounds, contentBounds } = this.props;
    const startingBounds = initialBounds || contentBounds;
    if (startingBounds) {
      const bounds = new google.maps.LatLngBounds();
      startingBounds.forEach((point: Coordinate) => bounds.extend(arrayToGmaps(point)!));
      map.setCenter(bounds.getCenter());
      map.fitBounds(bounds);

      // remove one zoom level to ensure no marker is on the edge.
      map.setZoom(map.getZoom() - 1);
    }
  };

  render() {
    return (
      <GoogleMap onLoaded={this.onLoaded}>
        {this.props.children}
      </GoogleMap>
    );
  }

}
