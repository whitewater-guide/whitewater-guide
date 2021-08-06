import React from 'react';
import ReactDOM from 'react-dom';

export interface InfoWindowProps {
  map?: google.maps.Map;

  defaultOptions?: any;
  defaultPosition?: google.maps.LatLng | google.maps.LatLngLiteral;
  defaultZIndex?: number;
  options?: any;
  position?: google.maps.LatLng | google.maps.LatLngLiteral;
  zIndex?: number;

  onCloseClick?: () => void;
  onDomReady?: () => void;
  onContentChanged?: () => void;
  onPositionChanged?: () => void;
  onZindexChanged?: (zIndex: number) => void;
}

const EVENT_MAP_ENTRIES: Array<[keyof InfoWindowProps, string]> = [
  ['onCloseClick', 'closeclick'],
  ['onDomReady', 'domready'],
  ['onContentChanged', 'content_changed'],
  ['onPositionChanged', 'position_changed'],
  ['onZindexChanged', 'zindex_changed'],
];

/**
 * Based on https://github.com/tomchentw/react-google-maps
 * A wrapper around `google.maps.InfoWindow`
 *
 * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#InfoWindow
 */
export class InfoWindow extends React.PureComponent<InfoWindowProps> {
  infoWindow: google.maps.InfoWindow;

  containerElement: HTMLElement = document.createElement('div');

  listeners: google.maps.MapsEventListener[] = [];

  constructor(props: InfoWindowProps) {
    super(props);
    this.infoWindow = new google.maps.InfoWindow({
      zIndex: props.zIndex || props.defaultZIndex,
      position: props.position || props.defaultPosition,
      maxWidth: 800,
    });
    if (props.map) {
      (this.infoWindow as any).setMap(props.map);
    }
  }

  componentDidMount() {
    this.registerListeners();
    this.infoWindow.setContent(this.containerElement);
    if (this.props.map) {
      this.open();
    }
  }

  componentDidUpdate(prevProps: InfoWindowProps) {
    this.unregisterListeners();
    if (this.props.zIndex && this.props.zIndex !== prevProps.zIndex) {
      this.infoWindow.setZIndex(this.props.zIndex);
    }
    if (this.props.position && this.props.position !== prevProps.position) {
      this.infoWindow.setPosition(this.props.position);
    }
    const iwMap = (this.infoWindow as any).getMap();
    if (!prevProps.map && !iwMap && this.props.map) {
      this.open();
    }
    this.registerListeners();
  }

  open = () => {
    this.infoWindow.open(this.props.map);
  };

  componentWillUnmount() {
    this.unregisterListeners();
    if (this.infoWindow) {
      // if (this.infoWindow.getContent()) {
      //   ReactDOM.unmountComponentAtNode(this.infoWindow.getContent() as Element);
      // }
      (this.infoWindow as any).setMap(null);
    }
  }

  registerListeners = () => {
    this.listeners = EVENT_MAP_ENTRIES.reduce(
      (listeners: google.maps.MapsEventListener[], [propName, event]) => {
        const prop = this.props[propName];
        if (prop && typeof prop === 'function') {
          listeners.push(
            google.maps.event.addListener(this.infoWindow, event, prop),
          );
        }
        return listeners;
      },
      [] as google.maps.MapsEventListener[],
    );
  };

  unregisterListeners = () =>
    this.listeners.forEach(google.maps.event.removeListener);

  render() {
    return ReactDOM.createPortal(
      React.Children.only(this.props.children),
      this.containerElement,
    );
  }
}
