import React, {PureComponent, PropTypes} from 'react';

export default class Polyline extends PureComponent {

  static propTypes = {
    origin: PropTypes.object,
    destination: PropTypes.object,
    maps: PropTypes.object,
    map: PropTypes.object,
  };

  componentWillUpdate() {
    this.line.setMap(null);
  }

  componentWillUnmount() {
    this.line.setMap(null);
  }

  getPaths() {
    const { origin, destination } = this.props;
    return [
      { lat: Number(origin.lat), lng: Number(origin.long) },
      { lat: Number(destination.lat), lng: Number(destination.long) }
    ];
  }

  render() {
    const Polyline = this.props.maps.Polyline;

    const renderedPolyline = this.renderPolyline();
    const paths = { path: this.getPaths() };

    this.line = new Polyline(Object.assign({}, renderedPolyline, paths));

    this.line.setMap(this.props.map);

    return null;
  }

  renderPolyline() {
    throw new Error('Implement renderPolyline method')
  }

}
