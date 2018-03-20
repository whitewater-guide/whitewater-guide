import React from 'react';
import { Coordinate, Coordinate2d } from '../../ww-commons/features/points/types';

interface Props {
  coordinates: Coordinate;
  map: google.maps.Map;
  draggable?: boolean;
  clickable?: boolean;
  onDragEnd?: (point: Coordinate2d) => void;
  icon?: string | google.maps.Icon | google.maps.Symbol;
}

export class Marker extends React.PureComponent<Props> {

  point: google.maps.Marker | null = null;

  componentDidMount() {
    const { map, coordinates: [lng, lat], draggable, clickable, icon } = this.props;
    this.point = new google.maps.Marker({ position: { lat, lng }, map, draggable, clickable, icon });
    this.point.addListener('dragend', this.onDragEnd);
  }

  componentDidUpdate(prevProps: Props) {
    const { coordinates: [lng, lat] } = this.props;
    if (this.point && (prevProps.coordinates[0] !== lng || prevProps.coordinates[1] !== lat)) {
      this.point.setPosition({ lat, lng });
    }
  }

  componentWillUnmount() {
    if (this.point) {
      google.maps.event.clearListeners(this.point, 'dragend');
      this.point.setMap(null);
    }
  }

  onDragEnd = ({ latLng }: google.maps.MouseEvent) => {
    if (this.props.onDragEnd) {
      this.props.onDragEnd([latLng.lng(), latLng.lat()]);
    }
  };

  render() {
    return null;
  }

}
