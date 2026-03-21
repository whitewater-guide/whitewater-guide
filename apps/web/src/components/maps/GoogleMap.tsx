import React from 'react';
import { createPortal, findDOMNode } from 'react-dom';
import ReactResizeDetector from 'react-resize-detector';

import type { Styles } from '../../styles';
import { Loading } from '../Loading';
import type { MapElementProps } from './types';
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

export interface InitialPosition {
  center?: google.maps.LatLng | google.maps.LatLngLiteral;
  bounds?: google.maps.LatLngBounds;
  // Set to negative value to decrease auto-zoom
  zoom?: number;
}

export interface GoogleMapControlProps {
  position: google.maps.ControlPosition;
}

interface GoogleMapProps {
  onLoaded?: (map: google.maps.Map) => void;
  onZoom?: (zoom: number) => void;
  onBoundsChanged?: (bounds: google.maps.LatLngBounds) => void;
  onClick?: (point: google.maps.LatLngLiteral) => void;
  initialPosition?: InitialPosition;
  children:
    | React.ReactElement<MapElementProps>
    | Array<React.ReactElement<MapElementProps>>
    | boolean
    | null
    | undefined;
  controls?: Array<React.ReactElement<GoogleMapControlProps>>;
}

interface State {
  loaded: boolean;
  zoom?: number;
  bounds?: google.maps.LatLngBounds;
}

export default class GoogleMap extends React.Component<GoogleMapProps, State> {
  state: State = {
    loaded: false,
    zoom: DEFAULT_ZOOM,
    bounds: undefined,
  };

  map?: google.maps.Map;

  width = 0;

  height = 0;

  initialized = false;

  customControlDivs: Record<string, HTMLDivElement> = {};

  initialize = () => {
    if (this.initialized || this.height === 0 || !this.map) {
      return;
    }
    if (this.props.initialPosition) {
      const { bounds, center, zoom } = this.props.initialPosition;
      if (center) {
        this.map.setCenter(center);
      }
      if (bounds) {
        this.map.fitBounds(bounds);
      }
      if (zoom) {
        const actualZoom = zoom < 0 ? (this.map.getZoom() ?? 0) + zoom : zoom;
        this.map.setZoom(actualZoom);
      }
    }
    this.initialized = true;
  };

  setMapRef = (ref: HTMLDivElement | null) => {
    if (!ref) {
      return;
    }
    // eslint-disable-next-line react/no-find-dom-node
    this.map = new google.maps.Map(findDOMNode(ref) as HTMLElement, {
      center: DEFAULT_CENTER,
      zoom: this.state.zoom,
      keyboardShortcuts: false,
    });

    this.map.addListener('zoom_changed', this.onZoom);
    this.map.addListener('bounds_changed', this.onBoundsChanged);
    this.map.addListener('click', this.onClick);

    // Create custom zoom to fit control
    const zoomToFitcontrolDiv = document.createElement('div');
    addZoomToFit(zoomToFitcontrolDiv, this.map, this.onZoomToFit);

    // controlDiv.index = 1;
    this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
      zoomToFitcontrolDiv,
    );

    const { map } = this;
    this.props.controls?.forEach((item) => {
      if (item.key) {
        const controlDiv = document.createElement('div');
        this.customControlDivs[item.key] = controlDiv;
        map.controls[item.props.position].push(controlDiv);
      }
    });

    this.initialize();
    if (this.props.onLoaded) {
      this.props.onLoaded(this.map);
    }
    this.setState({ loaded: true });
  };

  componentWillUnmount() {
    if (this.map) {
      google.maps.event.clearInstanceListeners(this.map);
    }
  }

  onZoom = () => {
    if (!this.map) {
      return;
    }
    const zoom = this.map.getZoom() ?? 0;
    this.setState({ zoom });
    if (this.props.onZoom) {
      this.props.onZoom(zoom);
    }
  };

  onBoundsChanged = () => {
    const bounds = this.map?.getBounds();
    if (bounds) {
      this.setState({ bounds });
      this.props.onBoundsChanged?.(bounds);
    }
  };

  onClick = ({ latLng }: google.maps.MapMouseEvent) => {
    if (latLng) {
      this.props.onClick?.(latLng.toJSON());
    }
  };

  onResize = (width: number, height: number) => {
    this.width = width;
    this.height = height;
    if (this.map && width > 0 && height > 0) {
      this.initialize();
      google.maps.event.trigger(this.map, 'resize');
    }
  };

  onZoomToFit = () => {
    const latLngBounds = new google.maps.LatLngBounds();
    this.map?.data.forEach((feature) => {
      const geometry = feature.getGeometry();
      geometry?.forEachLatLng((latLng) => latLngBounds.extend(latLng));
    });
    this.map?.setCenter(latLngBounds.getCenter());
    this.map?.fitBounds(latLngBounds);
  };

  render() {
    return (
      <div style={styles.container}>
        <ReactResizeDetector
          handleWidth
          handleHeight
          onResize={this.onResize}
        />
        <div style={styles.map} ref={this.setMapRef} />
        {!this.state.loaded && <Loading />}
        {this.state.loaded &&
          React.Children.map(
            this.props.children,
            (child: React.ReactElement<MapElementProps>) =>
              child &&
              React.cloneElement(child, {
                map: this.map,
                zoom: this.state.zoom,
                bounds: this.state.bounds,
              }),
          )}
        {this.state.loaded &&
          this.props.controls?.map((control) => {
            if (!control.key) {
              return null;
            }
            const ctrlDiv = this.customControlDivs[control.key];
            if (!ctrlDiv) {
              return null;
            }
            return createPortal(control, ctrlDiv);
          })}
      </div>
    );
  }
}
