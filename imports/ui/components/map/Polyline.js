import React, {PureComponent, PropTypes} from 'react';

export default class Polyline extends PureComponent {

  static propTypes = {
    origin: PropTypes.object,
    destination: PropTypes.object,
    maps: PropTypes.object,
    map: PropTypes.object,
  };

  line = null;

  componentDidMount(){
    const {maps, map} = this.props;
    this.line = new maps.Polyline({path: this.getPaths(), map, ...this.getStyle()});
  }

  componentDidUpdate(prevProps){
    const {origin, destination} = this.props;
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
      { lat: Number(destination.lat), lng: Number(destination.lng) }
    ];
  }

  render() {
    return null;
  }

  getStyle() {
    throw new Error('Implement getStyle method')
  }

}
