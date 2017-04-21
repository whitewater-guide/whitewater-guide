import React from 'react';
import PropTypes from 'prop-types';
import GoogleMap from './GoogleMap';
import { arrayToGmaps, gmapsToArray } from '../../../commons/utils/GeoUtils';

const DrawingOptions = {
  markerOptions: {
    draggable: true,
  },
  polylineOptions: {
    strokeColor: 'black',
    strokeOpacity: 1,
    strokeWeight: 2,
    editable: true,
    draggable: true,
    icons: [{
      icon: {
        path: 1, // maps.SymbolPath.FORWARD_CLOSED_ARROW
      },
      offset: '100%',
      repeat: '80px',
    }],
  },
  polygonOptions: {
    strokeColor: 'black',
    fillOpacity: 0.45,
    strokeOpacity: 1,
    strokeWeight: 2,
    editable: true,
    draggable: true,
  },
  drawingControl: false,
};

export default class DrawingMap extends React.Component {
  static propTypes = {
    initialPoints: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    drawingMode: PropTypes.oneOf(['polyline', 'polygon', 'marker']),
    bounds: PropTypes.object,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    initialPoints: [],
    drawingMode: 'polyline',
    onChange: () => {},
    bounds: null,
  };

  constructor(props) {
    super(props);
    this.map = null;
    this.maps = null;
    this.drawingManager = null;
    this.overlay = null;
    this.listeners = [];
  }

  componentWillUnmount() {
    this.listeners.forEach(listener => this.maps.event.removeListener(listener));
    this.listeners = [];
  }

  init = ({ map, maps }) => {
    const { drawingMode, initialPoints, bounds } = this.props;
    this.map = map;
    this.maps = maps;

    // Set bounds
    if (bounds || (initialPoints && initialPoints.length > 1)) {
      const latLngBounds = new maps.LatLngBounds();
      if (initialPoints && initialPoints.length > 1) {
        initialPoints.forEach(point => latLngBounds.extend(arrayToGmaps(point)));
      } else {
        latLngBounds.extend(arrayToGmaps(bounds.sw));
        latLngBounds.extend(arrayToGmaps(bounds.ne));
      }
      map.setCenter(latLngBounds.getCenter());
      map.fitBounds(latLngBounds);
      map.setZoom(map.getZoom() - 1);
    } else if (initialPoints.length === 1) {
      map.setCenter(arrayToGmaps(initialPoints[0]));
      map.setZoom(14);
    }

    this.drawingManager = new maps.drawing.DrawingManager({ map, drawingMode, ...DrawingOptions });
    this.listeners.push(maps.event.addListener(this.drawingManager, 'overlaycomplete', this.handleOverlayComplete));
    if (initialPoints && initialPoints.length > 0) {
      let overlay = null;
      if (drawingMode === 'marker') {
        overlay = new maps.Marker({ map, position: arrayToGmaps(initialPoints[0]), ...DrawingOptions.markerOptions });
      } else if (drawingMode === 'polyline') {
        overlay = new maps.Polyline({ ...DrawingOptions.polylineOptions, map, path: initialPoints.map(arrayToGmaps) });
      } else if (drawingMode === 'polygon') {
        overlay = new maps.Polygon({ ...DrawingOptions.polygonOptions, map, paths: [initialPoints.map(arrayToGmaps)] });
      }
      if (overlay) {
        maps.event.trigger(this.drawingManager, 'overlaycomplete', { type: drawingMode, overlay, initial: true });
      }
    }
  };

  handleOverlayComplete = ({ type, overlay, initial }) => {
    this.drawingManager.setDrawingMode(null);// One shape max
    this.overlay = overlay;
    if (type === 'marker') {
      this.listeners.push(this.maps.event.addListener(overlay, 'dragend', this.handleChange));
    } else {
      this.listeners.push(this.maps.event.addListener(overlay, 'dblclick', this.handleVertexRemoval));
      const path = type === 'polygon' ? overlay.getPaths().getAt(0) : overlay.getPath();
      this.listeners.push(this.maps.event.addListener(path, 'set_at', this.handleChange));
      this.listeners.push(this.maps.event.addListener(path, 'insert_at', this.handleChange));
      this.listeners.push(this.maps.event.addListener(path, 'remove_at', this.handleChange));
    }
    if (!initial) {
      this.handleChange();
    }
  };

  handleVertexRemoval = ({ vertex }) => {
    if (vertex === undefined) {
      return;
    }
    const path = this.overlay.getPath();
    if (
      (this.props.drawingMode === 'polygon' && path.length > 3) ||
      (this.props.drawingMode === 'polyline' && path.length > 2)
    ) {
      path.removeAt(vertex);
    }
  };

  handleChange = () => {
    const { drawingMode, onChange } = this.props;
    let latLngs = null;
    if (drawingMode === 'marker'){
      latLngs = [this.overlay.getPosition()];
    } else {
      latLngs = this.overlay.getPath().getArray();
    }
    if (latLngs) {
      onChange(latLngs.map(gmapsToArray));
    }
  };

  render() {
    return (
      <GoogleMap onLoaded={this.init} />
    );
  }

}
