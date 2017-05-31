import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import GoogleMap from './GoogleMap';
import PlacesAutocomplete from './PlacesAutocomplete';
import { arrayToGmaps, gmapsToArray, getCoordinatesPatch } from '../../../commons/utils/GeoUtils';

const DrawingStyles = {
  Point: {
    draggable: true,
  },
  LineString: {
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

const minPoints = { Point: 1, LineString: 2, Polygon: 3 };

export default class DrawingMap extends React.Component {
  static propTypes = {
    points: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    drawingMode: PropTypes.oneOf(['LineString', 'Polygon', 'Point']),
    bounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    onChange: PropTypes.func,
    onLoaded: PropTypes.func,
  };

  static defaultProps = {
    points: [],
    drawingMode: 'LineString',
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

  componentDidUpdate(prevProps) {
    if (!this.map) {
      return;
    }
    const { points, drawingMode } = this.props;
    const latLngs = points.map(arrayToGmaps);

    if (this.feature) {
      this.ignoreSetGeometryEvent = true;

      if (drawingMode === 'Point') {
        this.feature.setGeometry(new this.maps.Data.Point(latLngs[0]));
      } else if (drawingMode === 'LineString') {
        this.feature.setGeometry(new this.maps.Data.LineString(latLngs));
      } else if (drawingMode === 'Polygon') {
        this.feature.setGeometry(new this.maps.Data.Polygon([latLngs]));
      }
      this.ignoreSetGeometryEvent = false;
    } else if (points.length >= minPoints[drawingMode]) {
      this.addFeature(points);
    } else if (points.length === 1 && prevProps.points.length === 0) {
      const icon = {
        // path: 'M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0',
        path: 'M-10,0 L10,0 M0,-10 L0,10',
        strokeColor: '#FF0000',
        strokeWeight: 1,
        anchor: new this.maps.Point(0, 0),
        scale: 1,
      };
      const marker = new this.maps.Marker({
        position: { lat: points[0][1], lng: points[0][0] },
        map: this.map,
        draggable: false,
        clickable: false,
        icon,
        zIndex: -20,
      });
    }
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
    const latLngBounds = new maps.LatLngBounds();
    if (points && points.length === 1) {
      map.setCenter(arrayToGmaps(points[0]));
      map.setZoom(14);
    } else if (points && points.length > 1) {
      points.forEach(point => latLngBounds.extend(arrayToGmaps(point)));
      map.setCenter(latLngBounds.getCenter());
      map.fitBounds(latLngBounds);
    } else if (bounds) {
      bounds.forEach(point => latLngBounds.extend(arrayToGmaps(point)));
      map.setCenter(latLngBounds.getCenter());
      map.fitBounds(latLngBounds);
    }
    this.map.data.setStyle(DrawingStyles[drawingMode]);
    if (points && points.length > 0) {
      this.addFeature(points);
    } else {
      map.data.setControls([drawingMode]);
    }
    map.data.setControlPosition(maps.ControlPosition.LEFT_TOP);
    maps.event.addListener(map.data, 'addfeature', this.handleAddFeature);
    maps.event.addListener(map.data, 'setgeometry', this.handleChange);
    maps.event.addListener(map.data, 'dblclick', this.handleVertexRemoval);
    if (this.props.onLoaded) {
      this.props.onLoaded({ map, maps });
    }
  };

  addFeature = (points) => {
    const { drawingMode } = this.props;
    this.map.data.setDrawingMode(null);
    this.map.data.setControls(null);
    let geometry = null;
    const latLngs = points.map(arrayToGmaps);
    if (drawingMode === 'Point') {
      geometry = new this.maps.Data.Point(latLngs[0]);
    } else if (drawingMode === 'LineString') {
      geometry = new this.maps.Data.LineString(latLngs);
    } else if (drawingMode === 'Polygon') {
      geometry = new this.maps.Data.Polygon([latLngs]);
    }
    if (geometry) {
      this.feature = new this.maps.Data.Feature({ geometry });
      this.map.data.add(this.feature);
    }
  };

  handleAddFeature = ({ feature }) => {
    this.feature = feature;
    this.map.data.setDrawingMode(null);
    this.map.data.setControls(null);
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
    } else if (this.props.drawingMode === 'LineString') {
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
      <GoogleMap onLoaded={this.init}>
        <PlacesAutocomplete />
      </GoogleMap>
    );
  }

}
