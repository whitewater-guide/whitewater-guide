import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import GoogleMap from './GoogleMap';
import { arrayToGmaps, gmapsToArray, getCoordinatesPatch } from '../../../commons/utils/GeoUtils';

const DrawingStyles = {
  Point: {
    draggable: true,
  },
  Polyline: {
    strokeColor: 'black',
    strokeOpacity: 1,
    strokeWeight: 2,
    editable: true,
    draggable: false,
    icons: [{
      icon: {
        path: 1, // maps.SymbolPath.FORWARD_CLOSED_ARROW
      },
      offset: '100%',
      repeat: '80px',
    }],
  },
  Polygon: {
    strokeColor: 'black',
    fillOpacity: 0.45,
    strokeOpacity: 1,
    strokeWeight: 2,
    editable: true,
    draggable: false,
  },
};

const geometryToLatLngs = (geometry) => {
  if (!geometry) {
    return null;
  }
  const type = geometry.getType();
  if (type === 'Point') {
    return [geometry.get()];
  } else if (type === 'LineString') {
    return geometry.getArray();
  } else if (type === 'Polygon') {
    return geometry.getAt(0).getArray();
  }
  return null;
};

export default class DrawingMap extends React.Component {
  static propTypes = {
    points: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    drawingMode: PropTypes.oneOf(['Polyline', 'Polygon', 'Point']),
    bounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    onChange: PropTypes.func,
  };

  static defaultProps = {
    points: [],
    drawingMode: 'Polyline',
    onChange: () => {},
    bounds: null,
  };

  constructor(props) {
    super(props);
    this.map = null;
    this.maps = null;
    this.feature = null;
    this.ignoreSetGeometryEvent = false;
  }

  componentDidUpdate() {
    if (!this.feature) {
      return;
    }
    const { points, drawingMode } = this.props;
    const latLngs = points.map(arrayToGmaps);
    this.ignoreSetGeometryEvent = true;
    if (drawingMode === 'Point') {
      this.feature.setGeometry(new this.maps.Data.Point(latLngs[0]));
    } else if (drawingMode === 'Polyline') {
      this.feature.setGeometry(new this.maps.Data.LineString(latLngs));
    } else if (drawingMode === 'Polygon') {
      this.feature.setGeometry(new this.maps.Data.Polygon([latLngs]));
    }
    this.ignoreSetGeometryEvent = false;
  }

  componentWillUnmount() {
    if (this.maps) {
      this.maps.event.clearInstanceListeners(this.map.data);
    }
  }

  init = ({ map, maps }) => {
    const { drawingMode, points, bounds } = this.props;
    this.map = map;
    this.maps = maps;

    // Set bounds
    if (bounds || (points && points.length > 1)) {
      const latLngBounds = new maps.LatLngBounds();
      if (points) {
        points.forEach(point => latLngBounds.extend(arrayToGmaps(point)));
      } else {
        bounds.forEach(point => latLngBounds.extend(arrayToGmaps(point)));
      }
      map.setCenter(latLngBounds.getCenter());
      map.fitBounds(latLngBounds);
    } else if (points.length === 1) {
      map.setCenter(arrayToGmaps(points[0]));
      map.setZoom(14);
    }
    this.map.data.setStyle(DrawingStyles[drawingMode]);
    if (points && points.length > 0) {
      this.map.data.setDrawingMode(null);
      let geometry = null;
      const latLngs = points.map(arrayToGmaps);
      if (drawingMode === 'Point') {
        geometry = new maps.Data.Point(latLngs[0]);
      } else if (drawingMode === 'Polyline') {
        geometry = new maps.Data.LineString(latLngs);
      } else if (drawingMode === 'Polygon') {
        geometry = new maps.Data.Polygon([latLngs]);
      }
      if (geometry) {
        this.feature = new maps.Data.Feature({ geometry });
        map.data.add(this.feature);
      }
    } else {
      map.data.setDrawingMode(drawingMode);
    }
    maps.event.addListener(map.data, 'addfeature', this.handleAddFeature);
    maps.event.addListener(map.data, 'setgeometry', this.handleChange);
    maps.event.addListener(map.data, 'dblclick', this.handleVertexRemoval);
  };

  handleAddFeature = ({ feature }) => {
    this.feature = feature;
    this.map.data.setDrawingMode(null);
    this.handleChange({ newGeometry: feature.getGeometry() });
  };

  handleVertexRemoval = ({ feature, latLng }) => {
    const lat = latLng.lat();
    const lng = latLng.lng();
    if (this.props.drawingMode === 'Polygon') {
      let latLngs = feature.getGeometry().getAt(0).getArray();
      if (latLngs.length > 3) {
        latLngs = latLngs.filter(ll => ll.lat() !== lat && ll.lng() !== lng);
        if (latLngs.length >= 3) {
          feature.setGeometry(new this.maps.Data.Polygon([latLngs]));
        }
      }
    } else if (this.props.drawingMode === 'Polyline') {
      let latLngs = feature.getGeometry().getArray();
      if (latLngs.length > 2) {
        latLngs = latLngs.filter(ll => ll.lat() !== lat && ll.lng() !== lng);
        if (latLngs.length >= 2) {
          feature.setGeometry(new this.maps.Data.LineString(latLngs));
        }
      }
    }
  };

  handleChange = ({ newGeometry, oldGeometry }) => {
    if (this.ignoreSetGeometryEvent) {
      return;
    }
    // Google maps geometry has only lat and lng, but our geometry has also altitude
    // So if we just send google geometry, all the alts will vanish from our points
    // We have to figure out which point was changed, and if it was updated, keep it's altitude
    // It has positive side-effect of limiting google-maps screwing of rounding to only changed points
    const { points, onChange } = this.props;

    const newLatLngs = geometryToLatLngs(newGeometry);
    const newPoints = newLatLngs.map(gmapsToArray);
    if (oldGeometry) {
      // Need to patch points
      const oldLatLngs = geometryToLatLngs(oldGeometry);
      const oldPoints = oldLatLngs.map(gmapsToArray);
      const patch = getCoordinatesPatch(oldPoints, newPoints);
      if (patch.length === 3 && patch[1] === 1 && points[patch[0]].length > 2) {
        // Some point with altitude was updated, need to keep the altitude
        patch[2][2] = points[patch[0]][2];
      }
      onChange(update(points, { $splice: [patch] }));
    } else {
      // New geometry was created, altitudes are nulls anyway
      onChange(newPoints);
    }
  };

  render() {
    return (
      <GoogleMap onLoaded={this.init} />
    );
  }

}
