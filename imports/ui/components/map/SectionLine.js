import React, {PropTypes} from 'react';
import Polyline from './Polyline';

export default class SectionLine extends Polyline {

  static propTypes = {
    ...Polyline.propTypes,
    sectionId: PropTypes.string,
    onClick: PropTypes.func,
  };

  getPaths() {
    const { origin, destination } = this.props;
    return [
      { lat: origin.coordinates[1], lng: origin.coordinates[0] },
      { lat: destination.coordinates[1], lng: destination.coordinates[0] }
    ];
  }

  getStyle() {
    return {
      geodesic: true,
      strokeColor: this.props.color || '#ff0000',
      strokeOpacity: 1,
      strokeWeight: 4,
      icons: [{
        icon: {path: this.props.maps.SymbolPath.FORWARD_CLOSED_ARROW},
        offset: '100%'
      }]
    }
  }
}