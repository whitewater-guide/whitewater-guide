import Polyline from './Polyline';

export default class SectionLine extends Polyline {

  getPaths() {
    const { origin, destination } = this.props;
    return [
      { lat: origin.coordinates[1], lng: origin.coordinates[0] },
      { lat: destination.coordinates[1], lng: destination.coordinates[0] }
    ];
  }

  renderPolyline() {
    return {
      geodesic: true,
      strokeColor: this.props.color || '#ff0000',
      strokeOpacity: 1,
      strokeWeight: 4
    }
  }
}