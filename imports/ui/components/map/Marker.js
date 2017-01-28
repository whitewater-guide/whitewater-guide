import React, {PureComponent, PropTypes} from 'react';

export default class Marker extends PureComponent {

  static propTypes = {
    coordinates: PropTypes.array,
    maps: PropTypes.object,
    map: PropTypes.object,
    draggable: PropTypes.bool,
    onDragEnd: PropTypes.func,
  };

  point = null;

  componentDidMount(){
    const {maps, map, coordinates, draggable} = this.props;
    this.point = new maps.Marker({position: {lat: coordinates[1], lng: coordinates[0]}, map, draggable});
    this.point.addListener('dragend', this.onDragEnd);
  }

  componentDidUpdate(prevProps, prevState){
    const {coordinates} = this.props;
    if (prevProps.coordinates[0] != coordinates[0] || prevProps.coordinates[1] != coordinates[1]){
      this.point.setPosition({lat: coordinates[1], lng: coordinates[0]});
    }
  }

  componentWillUnmount(){
    this.props.maps.event.clearListeners(this.point, 'dragend');
    this.point.setMap(null);
  }

  render() {
    return null;
  }

  onDragEnd = ({latLng}) => {
    if (this.props.onDragEnd)
      this.props.onDragEnd([latLng.lng(), latLng.lat()]);
  };


}
