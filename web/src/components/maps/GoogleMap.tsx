import * as React from 'react';
import { findDOMNode } from 'react-dom';
import ResizeObserver from 'resize-observer-polyfill';
import { Styles } from '../../styles/types';
import { addZoomToFit } from './ZoomToFitControl';

const styles: Styles = {
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

interface Props {
  onLoaded: (map: google.maps.Map) => void;
  onZoom?: (zoom: number) => void;
  onBoundsChanged?: (bounds: google.maps.LatLngBounds) => void;
  onClick?: (point: google.maps.LatLngLiteral) => void;
}

interface State {
  zoom: number;
  bounds: google.maps.LatLngBounds | null;
}

export default class GoogleMap extends React.Component<Props, State> {
  state: State = {
    zoom: DEFAULT_ZOOM,
    bounds: null,
  };

  map: google.maps.Map | null = null;
  // tslint:disable-next-line:no-inferrable-types
  width: number = 0;
  // tslint:disable-next-line:no-inferrable-types
  height: number = 0;
  mapRef: React.ReactInstance | null = null;
  resizeObserver: ResizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      this.onResize(entry);
    }
  });

  setMapRef = (ref: HTMLDivElement | null) => {
    if (!ref) {
      return;
    }
    this.map = new google.maps.Map(
      findDOMNode(ref!),
      { center: DEFAULT_CENTER, zoom: this.state.zoom },
    );

    this.map.addListener('zoom_changed', this.onZoom);
    this.map.addListener('bounds_changed', this.onBoundsChanged);
    this.map.addListener('click', this.onClick);

    // Create custom zoom to fit control
    const controlDiv = document.createElement('div');
    addZoomToFit(controlDiv, this.map, this.onZoomToFit);

    // controlDiv.index = 1;
    this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);

    this.props.onLoaded(this.map);
  };

  componentWillUnmount() {
    if (this.map) {
      google.maps.event.clearInstanceListeners(this.map);
    }
    this.resizeObserver.disconnect();
  }

  onZoom = () => {
    const zoom = this.map!.getZoom();
    this.setState({ zoom });
    if (this.props.onZoom) {
      this.props.onZoom(zoom);
    }
  };

  onBoundsChanged = () => {
    const bounds = this.map!.getBounds();
    this.setState({ bounds: bounds! });
    if (this.props.onBoundsChanged) {
      this.props.onBoundsChanged(bounds!);
    }
  };

  onClick = ({ latLng }: google.maps.MouseEvent) => {
    if (this.props.onClick) {
      this.props.onClick(latLng.toJSON());
    }
  };

  onResize = (entry: ResizeObserverEntry) => {
    const { width, height } = entry.contentRect;
    this.width = width;
    this.height = height;
    if (this.map && width > 0 && height > 0) {
      google.maps.event.trigger(this.map, 'resize');
    }
  };

  mountRoot = (root: HTMLDivElement | null) => {
    if (root) {
      const rootNode = findDOMNode(root);
      this.resizeObserver.observe(rootNode);
    }
  };

  onZoomToFit = () => {
    const latLngBounds = new google.maps.LatLngBounds();
    this.map!.data.forEach((feature) => {
      const geometry: google.maps.Data.Geometry = feature.getGeometry();
      geometry.forEachLatLng(latLng => latLngBounds.extend(latLng));
    });
    this.map!.setCenter(latLngBounds.getCenter());
    this.map!.fitBounds(latLngBounds);
  };

  render() {
    return (
      <div style={styles.container} ref={this.mountRoot}>
        <div style={styles.map} ref={this.setMapRef} />
        {React.Children.map(this.props.children, (child => React.cloneElement(child as React.ReactElement<any>, {
          map: this.map,
          zoom: this.state.zoom,
          bounds: this.state.bounds,
        })))}
      </div>
    );
  }
}
