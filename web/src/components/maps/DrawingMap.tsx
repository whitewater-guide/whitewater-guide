import * as update from 'immutability-helper';
import * as React from 'react';
import { arrayToGmaps, getCoordinatesPatch, gmapsToArray } from '../../ww-clients/utils/GeoUtils';
import { Coordinate, Coordinate3d } from '../../ww-commons/features/points';
import GoogleMap from './GoogleMap';
import PlacesAutocomplete from './PlacesAutocomplete';

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

interface Props {
  points: Coordinate3d[];
  drawingMode: 'LineString' | 'Polygon' | 'Point';
  bounds: Coordinate[] | null;
  onChange: (points: Coordinate3d[]) => void;
  onLoaded?: (map: google.maps.Map) => void;
}

export default class DrawingMap extends React.Component<Props> {

  map: google.maps.Map | null = null;
  feature: google.maps.Data.Feature | null = null;
  ignoreSetGeometryEvent: boolean = false;

  componentDidUpdate(prevProps: Props) {
    if (!this.map) {
      return;
    }
    const { points, drawingMode } = this.props;
    // points do not include nulls => latLngs do not include nulls too
    const latLngs: google.maps.LatLngLiteral[] = points.map(arrayToGmaps) as any;

    if (this.feature) {
      this.ignoreSetGeometryEvent = true;

      if (drawingMode === 'Point') {
        this.feature.setGeometry(new google.maps.Data.Point(latLngs[0]));
      } else if (drawingMode === 'LineString') {
        this.feature.setGeometry(new google.maps.Data.LineString(latLngs));
      } else if (drawingMode === 'Polygon') {
        this.feature.setGeometry(new google.maps.Data.Polygon([latLngs]));
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
        anchor: new google.maps.Point(0, 0),
        scale: 1,
      };
      const latLng = { lat: points[0][1], lng: points[0][0] };
      new google.maps.Marker({
        position: latLng,
        map: this.map,
        draggable: false,
        clickable: false,
        icon,
        zIndex: -20,
      });
      this.map.panTo(latLng);
      this.map.setZoom(11);
    }
  }

  componentWillUnmount() {
    if (this.map) {
      google.maps.event.clearInstanceListeners(this.map.data);
    }
  }

  init = (map: google.maps.Map) => {
    const { drawingMode, points, bounds } = this.props;
    this.map = map;

    // Set bounds
    const latLngBounds = new google.maps.LatLngBounds();
    if (points && points.length === 1) {
      map.setCenter(arrayToGmaps(points[0])!);
      map.setZoom(14);
    } else if (points && points.length > 1) {
      points.forEach(point => latLngBounds.extend(arrayToGmaps(point)!));
      map.setCenter(latLngBounds.getCenter());
      map.fitBounds(latLngBounds);
    } else if (bounds) {
      bounds.forEach(point => latLngBounds.extend(arrayToGmaps(point)!));
      map.setCenter(latLngBounds.getCenter());
      map.fitBounds(latLngBounds);
    }
    this.map.data.setStyle(DrawingStyles[drawingMode]);
    if (points && points.length > 0) {
      this.addFeature(points);
    } else {
      map.data.setControls([drawingMode]);
    }
    map.data.setControlPosition(google.maps.ControlPosition.LEFT_TOP);
    google.maps.event.addListener(map.data, 'addfeature', this.handleAddFeature);
    google.maps.event.addListener(map.data, 'setgeometry', this.handleChange);
    google.maps.event.addListener(map.data, 'dblclick', this.handleVertexRemoval);
    if (this.props.onLoaded) {
      this.props.onLoaded(map);
    }
  };

  addFeature = (points: Coordinate[]) => {
    const { drawingMode } = this.props;
    this.map!.data.setDrawingMode(null);
    this.map!.data.setControls(null);
    let geometry: google.maps.Data.Geometry | null = null;
    const latLngs: google.maps.LatLngLiteral[] = points.map(arrayToGmaps) as any;
    if (drawingMode === 'Point') {
      geometry = new google.maps.Data.Point(latLngs[0]);
    } else if (drawingMode === 'LineString') {
      geometry = new google.maps.Data.LineString(latLngs);
    } else if (drawingMode === 'Polygon') {
      geometry = new google.maps.Data.Polygon([latLngs]);
    }
    if (geometry) {
      this.feature = new google.maps.Data.Feature({ geometry });
      this.map!.data.add(this.feature);
    }
  };

  handleAddFeature = ({ feature }: { feature: google.maps.Data.Feature }) => {
    this.feature = feature;
    this.map!.data.setDrawingMode(null);
    this.map!.data.setControls(null);
    this.handleChange({ newGeometry: feature.getGeometry() });
  };

  handleVertexRemoval = ({ feature, latLng }: { feature: google.maps.Data.Feature, latLng: google.maps.LatLng }) => {
    const lat = latLng.lat();
    const lng = latLng.lng();
    if (this.props.drawingMode === 'Polygon') {
      let latLngs = (feature.getGeometry() as google.maps.Data.Polygon).getAt(0).getArray();
      if (latLngs.length > 3) {
        latLngs = latLngs.filter(ll => ll.lat() !== lat && ll.lng() !== lng);
        if (latLngs.length >= 3) {
          feature.setGeometry(new google.maps.Data.Polygon([latLngs]));
        }
      }
    } else if (this.props.drawingMode === 'LineString') {
      let latLngs = (feature.getGeometry() as google.maps.Data.LineString).getArray();
      if (latLngs.length > 2) {
        latLngs = latLngs.filter(ll => ll.lat() !== lat && ll.lng() !== lng);
        if (latLngs.length >= 2) {
          feature.setGeometry(new google.maps.Data.LineString(latLngs));
        }
      }
    }
  };

  handleChange = ({ newGeometry, oldGeometry }: { newGeometry: google.maps.Data.Geometry, oldGeometry?: google.maps.Data.Geometry }) => {
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
      if (patch!.length === 3 && patch![1] === 1 && points[patch![0]].length > 2) {
        // Some point with altitude was updated, need to keep the altitude
        patch![2][2] = points[patch![0]][2];
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
        <PlacesAutocomplete map={this.map!} />
      </GoogleMap>
    );
  }

}
