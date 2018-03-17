import * as React from 'react';
import * as ReactDOM from 'react-dom';

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

const EVENT_MAP = {
  onCloseClick: 'closeclick',
  onDomReady: 'domready',
  onContentChanged: 'content_changed',
  onPositionChanged: 'position_changed',
  onZindexChanged: 'zindex_changed',
};

/**
 * Based on https://github.com/tomchentw/react-google-maps
 * A wrapper around `google.maps.InfoWindow`
 *
 * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#InfoWindow
 */
export class InfoWindow extends React.PureComponent<InfoWindowProps> {

  infoWindow: google.maps.InfoWindow;
  containerElement: HTMLElement;
  listeners: google.maps.MapsEventListener[] = [];

  constructor(props: InfoWindowProps) {
    super(props);
    this.infoWindow = new google.maps.InfoWindow({
      zIndex: props.zIndex || props.defaultZIndex,
      position: props.position || props.defaultPosition,
      maxWidth: 800,
    });
    if (props.map) {
      // @ts-ignore
      this.infoWindow.setMap(props.map);
    }
  }

  componentWillMount() {
    if (this.containerElement) {
      return;
    }
    this.containerElement = document.createElement('div');
  }

  componentDidMount() {
    this.registerListeners();
    this.infoWindow.setContent(this.containerElement);
    // @ts-ignore
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
    // @ts-ignore
    const iwMap = this.infoWindow.getMap();
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
      // @ts-ignore
      this.infoWindow.setMap(null);
    }
  }

  registerListeners = () => {
    this.listeners = Object.entries(EVENT_MAP).reduce(
      (listeners: google.maps.MapsEventListener[], [propName, event]: [keyof InfoWindowProps, string]) => {
        const prop = this.props[propName];
        if (prop && typeof prop === 'function') {
          listeners.push(google.maps.event.addListener(this.infoWindow, event, prop));
        }
        return listeners;
      },
      [] as google.maps.MapsEventListener[],
    );
  };

  unregisterListeners = () => this.listeners.forEach(google.maps.event.removeListener);

  render() {
    return ReactDOM.createPortal(
      React.Children.only(this.props.children),
      this.containerElement,
    );
  }
}