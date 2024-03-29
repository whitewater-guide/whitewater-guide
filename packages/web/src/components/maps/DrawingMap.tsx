/* eslint-disable @typescript-eslint/no-redeclare */
import type { Coordinate2d } from '@whitewater-guide/clients';
import {
  arrayToGmaps,
  ensureAltitude,
  getCoordinatesPatch,
  gmapsToArray,
} from '@whitewater-guide/clients';
import update from 'immutability-helper';
import React from 'react';

import { geometryToLatLngs } from '../../utils/google-maps';
import type { InitialPosition } from './GoogleMap';
import GoogleMap from './GoogleMap';
import MapLoader from './MapLoader';
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
    icons: [
      {
        icon: {
          path: 1, // maps.SymbolPath.FORWARD_CLOSED_ARROW
        },
        offset: '100%',
        repeat: '80px',
      },
    ],
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

const minPoints = { Point: 1, LineString: 2, Polygon: 3 };

interface Props {
  points?: CodegenCoordinates[];
  drawingMode: 'LineString' | 'Polygon' | 'Point';
  bounds: CodegenCoordinates[] | null;
  onChange: (points: CodegenCoordinates[]) => void;
  onLoaded?: (map: google.maps.Map) => void;
}

class DrawingMapInternal extends React.Component<Props> {
  map: google.maps.Map | null = null;

  feature: google.maps.Data.Feature | null = null;

  ignoreSetGeometryEvent = false;

  initialPosition?: InitialPosition;

  constructor(props: Props) {
    super(props);
    const { points, bounds } = this.props;
    const latLngBounds = new google.maps.LatLngBounds();
    if (points && points.length === 1) {
      this.initialPosition = {
        center: arrayToGmaps(points[0]),
        zoom: 14,
      };
    } else if (points && points.length > 1) {
      points.forEach((point) => latLngBounds.extend(arrayToGmaps(point)));
      this.initialPosition = {
        center: latLngBounds.getCenter(),
        bounds: latLngBounds,
      };
    } else if (bounds) {
      bounds.forEach((point) => latLngBounds.extend(arrayToGmaps(point)));
      this.initialPosition = {
        center: latLngBounds.getCenter(),
        bounds: latLngBounds,
      };
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (!this.map) {
      return;
    }
    const { drawingMode } = this.props;
    const points = this.props.points || [];
    const prevPoints = prevProps.points || [];
    // points do not include nulls => latLngs do not include nulls too
    const latLngs: google.maps.LatLngLiteral[] = points.map(
      arrayToGmaps,
    ) as google.maps.LatLngLiteral[];

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

      if (points.length === 0) {
        this.map.data.setDrawingMode(drawingMode);
        this.map.data.setControls([drawingMode]);
      }
    } else if (points.length >= minPoints[drawingMode]) {
      this.addFeature(points);
    } else if (points.length === 1 && prevPoints.length === 0) {
      const icon = {
        // path: 'M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0',
        path: 'M-10,0 L10,0 M0,-10 L0,10',
        strokeColor: '#FF0000',
        strokeWeight: 1,
        anchor: new google.maps.Point(0, 0),
        scale: 1,
      };
      const latLng = { lat: points[0][1], lng: points[0][0] };
      // eslint-disable-next-line no-new
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
    const { drawingMode, points } = this.props;
    this.map = map;
    this.map.data.setStyle(DrawingStyles[drawingMode]);
    if (points && points.length > 0) {
      this.addFeature(points);
    } else {
      map.data.setControls([drawingMode]);
    }
    map.data.setControlPosition(google.maps.ControlPosition.LEFT_TOP);
    google.maps.event.addListener(
      map.data,
      'addfeature',
      this.handleAddFeature,
    );
    google.maps.event.addListener(map.data, 'setgeometry', this.handleChange);
    google.maps.event.addListener(
      map.data,
      'dblclick',
      this.handleVertexRemoval,
    );
    if (this.props.onLoaded) {
      this.props.onLoaded(map);
    }
  };

  addFeature = (points: CodegenCoordinates[]) => {
    if (!this.map) {
      return;
    }
    const { drawingMode } = this.props;
    this.map.data.setDrawingMode(null);
    this.map.data.setControls(null);
    let geometry: google.maps.Data.Geometry | null = null;
    const latLngs: google.maps.LatLngLiteral[] = points.map(arrayToGmaps);
    if (drawingMode === 'Point') {
      geometry = new google.maps.Data.Point(latLngs[0]);
    } else if (drawingMode === 'LineString') {
      geometry = new google.maps.Data.LineString(latLngs);
    } else if (drawingMode === 'Polygon') {
      geometry = new google.maps.Data.Polygon([latLngs]);
    }
    if (geometry) {
      this.feature = new google.maps.Data.Feature({ geometry });
      this.map.data.add(this.feature);
    }
  };

  handleAddFeature = ({ feature }: { feature: google.maps.Data.Feature }) => {
    if (!this.map) {
      return;
    }
    this.feature = feature;
    this.map.data.setDrawingMode(null);
    this.map.data.setControls(null);
    const newGeometry = feature.getGeometry();
    if (newGeometry) {
      this.handleChange({ newGeometry });
    }
  };

  handleVertexRemoval = ({
    feature,
    latLng,
  }: {
    feature: google.maps.Data.Feature;
    latLng: google.maps.LatLng;
  }) => {
    const lat = latLng.lat();
    const lng = latLng.lng();
    if (this.props.drawingMode === 'Polygon') {
      let latLngs = (feature.getGeometry() as google.maps.Data.Polygon)
        .getAt(0)
        .getArray();
      if (latLngs.length > 3) {
        latLngs = latLngs.filter((ll) => ll.lat() !== lat && ll.lng() !== lng);
        if (latLngs.length >= 3) {
          feature.setGeometry(new google.maps.Data.Polygon([latLngs]));
        }
      }
    } else if (this.props.drawingMode === 'LineString') {
      let latLngs = (
        feature.getGeometry() as google.maps.Data.LineString
      ).getArray();
      if (latLngs.length > 2) {
        latLngs = latLngs.filter((ll) => ll.lat() !== lat && ll.lng() !== lng);
        if (latLngs.length >= 2) {
          feature.setGeometry(new google.maps.Data.LineString(latLngs));
        }
      }
    }
  };

  handleChange = ({
    newGeometry,
    oldGeometry,
  }: {
    newGeometry: google.maps.Data.Geometry;
    oldGeometry?: google.maps.Data.Geometry;
  }) => {
    if (this.ignoreSetGeometryEvent) {
      return;
    }
    // Google maps geometry has only lat and lng, but our geometry has also altitude
    // So if we just send google geometry, all the alts will vanish from our points
    // We have to figure out which point was changed, and if it was updated, keep it's altitude
    // It has positive side-effect of limiting google-maps screwing of rounding to only changed points
    const { onChange } = this.props;
    const points = this.props.points || [];

    const newLatLngs = geometryToLatLngs(newGeometry) ?? [];
    const newPoints = newLatLngs.map(gmapsToArray) as Coordinate2d[];
    if (oldGeometry) {
      // Need to patch points
      const oldLatLngs: google.maps.LatLng[] = geometryToLatLngs(
        oldGeometry,
      ) as google.maps.LatLng[];
      const oldPoints = oldLatLngs.map(gmapsToArray) as Coordinate2d[];
      // it's just simpler this way
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const patch: any = getCoordinatesPatch(oldPoints, newPoints);
      if (!patch) {
        return; // Equal, no need to fire change event
      }
      if (patch.length === 3 && patch[1] === 1 && points[patch[0]].length > 2) {
        // Some point with altitude was updated, need to keep the altitude
        patch[2][2] = points[patch[0]][2];
      }
      onChange(ensureAltitude(update(points, { $splice: [patch] })));
    } else {
      // New geometry was created
      const newPoints3d = ensureAltitude(newPoints);
      if (points.length === newPoints3d.length) {
        for (let i = 0; i < points.length; i += 1) {
          newPoints3d[i][2] = points[i][2] || 0;
        }
      }
      onChange(newPoints3d);
    }
  };

  render() {
    return (
      <GoogleMap onLoaded={this.init} initialPosition={this.initialPosition}>
        {!!this.map && <PlacesAutocomplete map={this.map} />}
      </GoogleMap>
    );
  }
}

export const DrawingMap: React.FC<Props> = (props) => (
  <MapLoader>
    <DrawingMapInternal {...props} />
  </MapLoader>
);
