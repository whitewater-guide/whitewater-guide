import PropTypes from 'prop-types';
import React, { cloneElement, Children } from 'react';
import { findDOMNode } from 'react-dom';
import withGoogleMapsApi from './withGoogleMapsApi';

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
    };
    this.map = null;
    this.maps = null;
    this.mapRef = null;
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
  }

  onZoom = () => {
    const zoom = this.map.getZoom();
    this.setState({ zoom });
    if (this.props.onZoom) {
      this.props.onZoom(zoom);
    }
  };

  onClick = ({ latLng }) => {
    if (this.props.onClick) {
      this.props.onClick(latLng.toJSON());
    }
  };

  loadMap() {
    const { google, loaded, onLoaded } = this.props;
    if (loaded && google) {
      this.maps = google.maps;
      this.map = new this.maps.Map(
        findDOMNode(this.mapRef),
        { center: DEFAULT_CENTER, zoom: this.state.zoom },
      );

      this.map.addListener('zoom_changed', this.onZoom);
      this.map.addListener('click', this.onClick);

      if (onLoaded) {
        onLoaded({ map: this.map, maps: this.maps });
      }
      this.setState({ mapCreated: true });
    }
  }

  render() {
    const { loaded, children } = this.props;
    if (!loaded) {
      return null;
    }
    return (
      <div style={styles.container}>
        <div style={styles.map} ref={(r) => { this.mapRef = r; }} />
        {this.state.mapCreated && Children.map(children, (child => cloneElement(child, {
          map: this.map,
          maps: this.maps,
          zoom: this.state.zoom,
        })))}
      </div>
    );
  }
}

export default withGoogleMapsApi({ libraries: ['drawing'] })(GoogleMap);
