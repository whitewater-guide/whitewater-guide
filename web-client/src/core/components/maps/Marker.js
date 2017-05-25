import React from 'react';
import PropTypes from 'prop-types';

export class Marker extends React.PureComponent {

  static propTypes = {
    coordinates: PropTypes.array,
    maps: PropTypes.object,
    map: PropTypes.object,
    draggable: PropTypes.bool,
    clickable: PropTypes.bool,
    onDragEnd: PropTypes.func,
    icon: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.point = null;
  }

  componentDidMount() {
    const { maps, map, coordinates, draggable, clickable, icon } = this.props;
    this.point = new maps.Marker({ position: { lat: coordinates[1], lng: coordinates[0] }, map, draggable, clickable, icon });
    this.point.addListener('dragend', this.onDragEnd);
  }

  componentDidUpdate(prevProps) {
    const { coordinates } = this.props;
    if (prevProps.coordinates[0] !== coordinates[0] || prevProps.coordinates[1] !== coordinates[1]) {
      this.point.setPosition({ lat: coordinates[1], lng: coordinates[0] });
    }
  }

  componentWillUnmount() {
    this.props.maps.event.clearListeners(this.point, 'dragend');
    this.point.setMap(null);
  }

  onDragEnd = ({ latLng }) => {
    if (this.props.onDragEnd) {
      this.props.onDragEnd([latLng.lng(), latLng.lat()]);
    }
  };

  render() {
    return null;
  }

}
