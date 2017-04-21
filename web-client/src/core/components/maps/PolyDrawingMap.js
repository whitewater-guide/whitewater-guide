import React from 'react';
import PropTypes from 'prop-types';
import GoogleMap from './GoogleMap';
import { gmapsToArray } from '../../../commons/utils/GeoUtils';

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

export default class PolyDrawingMap extends React.Component {
  static propTypes = {
    points: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    drawingMode: PropTypes.oneOf(['polyline', 'polygon', 'marker']),
    onChange: PropTypes.func,
  };

  static defaultProps = {
    points: [],
    drawingMode: 'polyline',
    onChange: () => {},
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
    const { drawingMode } = this.props;
    this.map = map;
    this.maps = maps;
    this.drawingManager = new maps.drawing.DrawingManager({ map, drawingMode, ...DrawingOptions });
    this.listeners.push(maps.event.addListener(this.drawingManager, 'overlaycomplete', this.handleOverlayComplete));
  };

  handleOverlayComplete = ({ type, overlay }) => {
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
    this.handleChange();
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
