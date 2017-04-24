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
    draggable: false,
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
    draggable: false,
  },
  drawingControl: false,
};

export default class DrawingMap extends React.Component {
  static propTypes = {
    points: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    drawingMode: PropTypes.oneOf(['polyline', 'polygon', 'marker']),
    bounds: PropTypes.object,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    points: [],
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
    this.overlayListeners = [];
  }

  componentDidUpdate() {
    if (!this.drawingManager) {
      return;
    }
    const { points, drawingMode } = this.props;
    const path = points.map(arrayToGmaps);
    if (drawingMode === 'marker') {
      this.overlay.setPosition(path[0]);
    } else {
      this.overlay.setPath(path);
    }
    // Reattaching listeners because the path was just replaced with new one
    // TODO: Possible optimization is to use deep-diff to find difference between arrays of points
    // and the call setAt()/removeAt() on existing path
    this.overlayListeners.forEach(listener => this.maps.event.removeListener(listener));
    this.attachListeners();
  }

  componentWillUnmount() {
    this.overlayListeners.forEach(listener => this.maps.event.removeListener(listener));
    this.overlayListeners = [];
    this.maps.event.clearInstanceListeners(this.drawingManager);
  }

  init = ({ map, maps }) => {
    const { drawingMode, points, bounds } = this.props;
    this.map = map;
    this.maps = maps;

    // Set bounds
    if (bounds || (points && points.length > 1)) {
      const latLngBounds = new maps.LatLngBounds();
      if (points && points.length > 1) {
        points.forEach(point => latLngBounds.extend(arrayToGmaps(point)));
      } else {
        latLngBounds.extend(arrayToGmaps(bounds.sw));
        latLngBounds.extend(arrayToGmaps(bounds.ne));
      }
      map.setCenter(latLngBounds.getCenter());
      map.fitBounds(latLngBounds);
      map.setZoom(map.getZoom() - 1);
    } else if (points.length === 1) {
      map.setCenter(arrayToGmaps(points[0]));
      map.setZoom(14);
    }

    this.drawingManager = new maps.drawing.DrawingManager({ map, drawingMode, ...DrawingOptions });
    maps.event.addListener(this.drawingManager, 'overlaycomplete', this.handleOverlayComplete);
    if (points && points.length > 0) {
      let overlay = null;
      if (drawingMode === 'marker') {
        overlay = new maps.Marker({ map, position: arrayToGmaps(points[0]), ...DrawingOptions.markerOptions });
      } else if (drawingMode === 'polyline') {
        overlay = new maps.Polyline({ ...DrawingOptions.polylineOptions, map, path: points.map(arrayToGmaps) });
      } else if (drawingMode === 'polygon') {
        overlay = new maps.Polygon({ ...DrawingOptions.polygonOptions, map, paths: [points.map(arrayToGmaps)] });
      }
      if (overlay) {
        maps.event.trigger(this.drawingManager, 'overlaycomplete', { type: drawingMode, overlay, initial: true });
      }
    }
  };

  handleOverlayComplete = ({ overlay, initial }) => {
    this.drawingManager.setDrawingMode(null);// One shape max
    this.overlay = overlay;
    this.attachListeners();
    if (!initial) {
      this.handleChange();
    }
  };

  attachListeners = () => {
    if (this.props.drawingMode === 'marker') {
      this.overlayListeners.push(this.maps.event.addListener(this.overlay, 'dragend', this.handleChange));
    } else {
      this.overlayListeners.push(this.maps.event.addListener(this.overlay, 'dblclick', this.handleVertexRemoval));
      const path = this.overlay.getPath();
      this.overlayListeners.push(this.maps.event.addListener(path, 'set_at', this.handleChange));
      this.overlayListeners.push(this.maps.event.addListener(path, 'insert_at', this.handleChange));
      this.overlayListeners.push(this.maps.event.addListener(path, 'remove_at', this.handleChange));
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
    if (drawingMode === 'marker') {
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
