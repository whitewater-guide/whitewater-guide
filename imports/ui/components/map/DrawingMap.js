import React, {PropTypes} from 'react';
import GoogleMap from './GoogleMap';
import _ from 'lodash';
import {arrayToGmaps, isValidLat, isValidLng} from '../../../utils/GeoUtils';

export default class DrawingMap extends React.Component {
  static propTypes = {
    numPoints: PropTypes.oneOf([1,2]),
    initialPoints: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    bounds: PropTypes.object,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    numPoints: 1,
    initialPoints: [],
  };

  constructor(props){
    super(props);
    const points = [];
    props.initialPoints.forEach(pt => {
      if (pt && isValidLng(pt[0]) && isValidLat(pt[1]))
        points.push([pt[0], pt[1]]);
    });
    this.state = {
      points,
    };
  }

  map = null;
  maps = null;
  line = null;
  markers = [];

  componentWillUnmount(){
    if (!this.map || !this.maps)
      return;
    if (this.line) {
      this.line.setMap(null);
      this.maps.event.clearInstanceListeners(this.line);
    }
    this.markers.forEach(m => {
      m.setMap(null);
      this.maps.event.clearInstanceListeners(m);
    });
    this.maps.event.clearInstanceListeners(this.map);
  }

  render() {
    return (
      <GoogleMap onClick={this.onClick} onLoaded={this.onLoaded}/>
    );
  }

  onLoaded = ({map, maps}) => {
    this.line = new maps.Polyline({
      strokeColor: '#000000',
      strokeOpacity: 1.0,
      strokeWeight: 3,
    });

    // Taken from http://stackoverflow.com/questions/22895079/google-map-api-v3-how-to-limit-number-of-polygon-lines-and-force-closure-at-th
    // Use bindTo to allow dynamic drag of markers to refresh poly.
    let MVCArrayBinder = function(mvcArray){
      this.array_ = mvcArray;
    };
    MVCArrayBinder.prototype = new maps.MVCObject();
    MVCArrayBinder.prototype.get = function(key) {
      if (!isNaN(parseInt(key))){
        return this.array_.getAt(parseInt(key));
      } else {
        this.array_.get(key);
      }
    };
    MVCArrayBinder.prototype.set = function(key, val) {
      if (!isNaN(parseInt(key))){
        this.array_.setAt(parseInt(key), val);
      } else {
        this.array_.set(key, val);
      }
    };
    this.line.binder = new MVCArrayBinder(this.line.getPath());
    this.line.setMap(map);

    this.map = map;
    this.maps = maps;

    this.state.points.forEach(([lng, lat]) => {
      this.onClick({lat, lng, initial: true});
    });

    //Set bounds
    if (this.props.bounds || this.state.points.length > 1) {
      let bounds = new maps.LatLngBounds();
      if (this.state.points.length > 1){
        this.state.points.forEach(point => bounds.extend(arrayToGmaps(point)));
      }
      else {
        bounds.extend(arrayToGmaps(this.props.bounds.sw));
        bounds.extend(arrayToGmaps(this.props.bounds.ne));
      }
      map.setCenter(bounds.getCenter());
      map.fitBounds(bounds);

      //remove one zoom level to ensure no marker is on the edge.
      map.setZoom(map.getZoom() - 1);
    }
    else if (this.state.points.length === 1){
      map.setCenter(arrayToGmaps(this.state.points[0]));
      map.setZoom(14);
    }
  };

  onClick = ({lat, lng, initial}) => {
    if (this.markers.length >= this.props.numPoints)
      return;

    const path = this.line.getPath();
    path.push(new this.maps.LatLng({lat, lng}));
    const len = path.getLength();
    const marker = new this.maps.Marker({
      position: {lat, lng},
      title: this.props.numPoints === 1 ? 'New POI' : (len === 1 ? 'Put-in' : 'Take-out'),
      label: this.props.numPoints === 1 ? undefined : (len === 1 ? 'A' : 'B'),
      map: this.map,
      draggable : true,
    });

    if (!initial) {
      let newPoints = [...this.state.points, [lng, lat]];
      this.setState({points: newPoints});
      if (this.props.onChange)
        this.props.onChange(newPoints);
    }

    marker.addListener('dragend', ({latLng}) => {
      let newPoints = _.cloneDeep(this.state.points);
      newPoints[len-1] = [latLng.lng(), latLng.lat()];
      this.setState({points: newPoints});
      if (this.props.onChange)
        this.props.onChange(this.state.points);
    });
    marker.bindTo('position', this.line.binder, (len-1).toString());
    this.markers.push(marker);
  };
}