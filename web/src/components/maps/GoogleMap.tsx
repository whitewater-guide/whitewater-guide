import PropTypes from 'prop-types';
import React, { cloneElement, Children } from 'react';
import { findDOMNode } from 'react-dom';
import ResizeObserver from 'resize-observer-polyfill';
import withGoogleMapsApi from './withGoogleMapsApi';
import ZoomToFitControl from './ZoomToFitControl';

const styles = {
  container: {
    width: '100%',
    height: '100%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
};

const DEFAULT_CENTER = { lat: 0, lng: 0 };
const DEFAULT_ZOOM = 3;

class GoogleMap extends React.Component {
  static propTypes = {
    onLoaded: PropTypes.func,
    onZoom: PropTypes.func,
    onBoundsChanged: PropTypes.func,
    onClick: PropTypes.func,
    loaded: PropTypes.bool,
    google: PropTypes.object,
    children: PropTypes.any,
  };

  static defaultProps = {
    onLoaded: () => {},
    onZoom: () => {},
    onClick: () => {},
    loaded: false,
    google: null,
    children: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      zoom: DEFAULT_ZOOM,
      mapCreated: false,
      bounds: null,
    };
    this.map = null;
    this.maps = null;
    this.mapRef = null;
    this.width = 0;
    this.height = 0;
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        this.onResize(entry);
      }
    });
  }

  componentDidMount() {
    this.loadMap();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.loaded && this.props.loaded) {
      this.loadMap();
    }
  }

  componentWillUnmount() {
    if (this.map && this.maps) {
      this.maps.event.clearInstanceListeners(this.map);
    }
    this.resizeObserver.disconnect();
  }

  onZoom = () => {
    const zoom = this.map.getZoom();
    this.setState({ zoom });
    if (this.props.onZoom) {
      this.props.onZoom(zoom);
    }
  };

  onBoundsChanged = () => {
    const bounds = this.map.getBounds();
    this.setState({ bounds });
    if (this.props.onBoundsChanged) {
      this.props.onBoundsChanged(bounds);
    }
  };

  onClick = ({ latLng }) => {
    if (this.props.onClick) {
      this.props.onClick(latLng.toJSON());
    }
  };

  onResize = (entry) => {
    const { width, height } = entry.contentRect;
    this.width = width;
    this.height = height;
    if (this.maps && width > 0 && height > 0) {
      this.maps.event.trigger(this.map, 'resize');
      this.callOnLoaded();
    }
  };

  loadMap() {
    const { google, loaded } = this.props;
    if (loaded && google) {
      this.maps = google.maps;
      this.map = new this.maps.Map(
        findDOMNode(this.mapRef),
        { center: DEFAULT_CENTER, zoom: this.state.zoom },
      );

      this.map.addListener('zoom_changed', this.onZoom);
      this.map.addListener('bounds_changed', this.onBoundsChanged);
      this.map.addListener('click', this.onClick);

      // Create custom zoom to fit control
      const controlDiv = document.createElement('div');
      const zoomToFitControl = new ZoomToFitControl(controlDiv, this.map, this.onZoomToFit);

      controlDiv.index = 1;
      this.map.controls[this.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);

      this.callOnLoaded();
    }
  }

  callOnLoaded = () => {
    // Sometimes map is created inside 0-height div (for example, inactive tabe)
    // In this case do not call onLoaded until it is resized
    if (!this.state.mapCreated && this.width > 0 && this.height > 0 && this.maps) {
      this.props.onLoaded({ map: this.map, maps: this.maps });
      this.setState({ mapCreated: true });
    }
  };

  mountRoot = (root) => {
    if (root) {
      const rootNode = findDOMNode(root);
      this.resizeObserver.observe(rootNode);
    }
  };

  onZoomToFit = () => {
    const latLngBounds = new this.maps.LatLngBounds();
    this.map.data.forEach((feature) => {
      const geometry = feature.getGeometry();
      geometry.forEachLatLng(latLng => latLngBounds.extend(latLng));
    });
    this.map.setCenter(latLngBounds.getCenter());
    this.map.fitBounds(latLngBounds);
  };

  render() {
    const { loaded, children } = this.props;
    if (!loaded) {
      return null;
    }
    return (
      <div style={styles.container} ref={this.mountRoot}>
        <div style={styles.map} ref={(r) => { this.mapRef = r; }} />
        {this.state.mapCreated && Children.map(children, (child => cloneElement(child, {
          map: this.map,
          maps: this.maps,
          zoom: this.state.zoom,
          bounds: this.state.bounds,
        })))}
      </div>
    );
  }
}

export default withGoogleMapsApi({ libraries: ['drawing', 'places'] })(GoogleMap);
