import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

export default class Polyline extends PureComponent {

  static propTypes = {
    origin: PropTypes.object,
    destination: PropTypes.object,
    maps: PropTypes.object,
    map: PropTypes.object,
    zoom: PropTypes.number,
  };

  line = null;

  componentDidMount(){
    const { maps, map } = this.props;
    this.line = new maps.Polyline({ path: this.getPaths(), map, ...this.getStyle() });
  }

  componentDidUpdate(prevProps) {
    const { origin, destination } = this.props;
    if (prevProps.origin !== origin || prevProps.desctination !== destination) {
      this.line.setPath(this.getPaths());
    }
  }

  componentWillUnmount(){
    this.line.setMap(null);
  }

  getPaths() {
    const { origin, destination } = this.props;
    return [
      { lat: Number(origin.lat), lng: Number(origin.lng) },
      { lat: Number(destination.lat), lng: Number(destination.lng) },
    ];
  }
  getStyle() {
    throw new Error('Implement getStyle method');
  }

  render() {
    return null;
  }

}