import {
  computeDistanceBetween,
  computeOffset,
  getBBox,
  getBoundsDeltaRegion,
  getBoundsZoomLevel,
  MapBody,
  MapComponentProps,
} from '@whitewater-guide/clients';
import { Coordinate } from '@whitewater-guide/commons';
import React from 'react';
import {
  InteractionManager,
  LayoutChangeEvent,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import RNMapView, { Region as MapsRegion } from 'react-native-maps';
import { withNavigationFocus } from 'react-navigation';
import { connect } from 'react-redux';
import shallowEqual from 'shallowequal';
import { RootState } from '../../core/reducers';
import LayersIcon from './LayersIcon';
import { SimplePOI } from './SimplePOI';
import { SimpleSection } from './SimpleSection';

const styles = StyleSheet.create({
  initialMapStyle: {
    ...StyleSheet.absoluteFillObject,
    top: 1,
  },
});

interface State {
  // See https://github.com/react-community/react-native-maps/issues/1033
  showMyLocationAndroidWorkaround: boolean;
}

interface OwnProps {
  renderArrowhead?: boolean;
}

interface FocusedProps {
  isFocused: boolean;
}

interface ConnectProps {
  mapType?: string;
}

type Props = OwnProps & MapComponentProps & FocusedProps & ConnectProps;

class MapView extends React.Component<Props, State> {
  _map: RNMapView | null = null;
  _mapLaidOut: boolean = false;
  _mapReady: boolean = false;
  _initialUserLocation: { latitude: number; longitude: number } | undefined;
  _bounds: Coordinate[] = [];
  _dimensions: { width: number; height: number } = { width: 0, height: 0 };
  _initialRegion: any;
  _initialRegionSet: boolean = false;

  readonly state: State = { showMyLocationAndroidWorkaround: false };

  constructor(props: Props) {
    super(props);
    this._initialRegion = getBoundsDeltaRegion(props.initialBounds);
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (!nextProps.isFocused) {
      return false;
    }
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    );
  }

  async componentDidMount() {
    if (Platform.OS === 'android') {
      const fine = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (!fine) {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        this.forceUpdate();
      }
    }
  }

  onDeselect = () => {
    const { onSectionSelected, onPOISelected } = this.props;
    if (onSectionSelected && onPOISelected) {
      this.props.onSectionSelected(null);
      this.props.onPOISelected(null);
    }
  };

  onRegionChange = (region: MapsRegion) => {
    this._bounds = [
      [
        region.longitude - region.longitudeDelta,
        region.latitude - region.latitudeDelta,
      ],
      [
        region.longitude + region.longitudeDelta,
        region.latitude + region.latitudeDelta,
      ],
    ];
    const zoomLevel = getBoundsZoomLevel(this._bounds, this._dimensions);
    this.props.onZoom(zoomLevel);
    // this.props.onBoundsSelected(this._bounds);
  };

  onMapLayout = ({
    nativeEvent: {
      layout: { width, height },
    },
  }: LayoutChangeEvent) => {
    this._dimensions = { width, height };
    if (this._map && !this._mapLaidOut) {
      this._mapLaidOut = true;
      this.setLocationAndRegion();
    }
  };

  onMapReady = () => {
    this._mapReady = true;
    this.setLocationAndRegion();
  };

  onUserLocationChange = (evt: any) => {
    if (this._initialUserLocation) {
      return;
    }
    this._initialUserLocation = evt.nativeEvent.coordinate;
    if (this._initialRegionSet) {
      InteractionManager.runAfterInteractions(this.zoomToMyLocation);
    }
  };

  setMapRef = (ref: RNMapView) => {
    this._map = ref;
  };

  setLocationAndRegion = () => {
    if (this._map && this._mapReady && this._mapLaidOut) {
      this.setState({ showMyLocationAndroidWorkaround: true }, () => {
        if (this.props.initialBounds) {
          this._map!.fitToCoordinates(
            this.props.initialBounds.map(([longitude, latitude]) => ({
              longitude,
              latitude,
            })),
            {
              edgePadding: { top: 20, left: 20, right: 20, bottom: 20 },
              animated: false,
            },
          );
        }
        this._initialRegionSet = true;
        if (this._initialUserLocation) {
          InteractionManager.runAfterInteractions(this.zoomToMyLocation);
        }
      });
    }
  };

  zoomToMyLocation = () => {
    if (!this._initialUserLocation || !this.props.initialBounds) {
      return;
    }
    const { latitude, longitude } = this._initialUserLocation;
    const [minLng, maxLng, minLat, maxLat] = getBBox(this.props.initialBounds);
    if (
      this._map &&
      latitude >= minLat &&
      latitude <= maxLat &&
      longitude >= minLng &&
      longitude <= maxLng
    ) {
      if (computeDistanceBetween([minLng, minLat], [maxLng, maxLat]) < 150) {
        this._map.animateToCoordinate({ latitude, longitude }, 300);
      } else {
        const corner = computeOffset({ latitude, longitude }, 200, -45);
        this._map.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: Math.abs(latitude - corner.latitude) / 2,
            longitudeDelta: Math.abs(longitude - corner.longitude) / 2,
          },
          300,
        );
      }
    }
  };

  render() {
    const mapStyle = this.state.showMyLocationAndroidWorkaround
      ? StyleSheet.absoluteFill
      : styles.initialMapStyle;
    const mapType: any = this.props.mapType || 'standard';
    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <RNMapView
          showsUserLocation
          showsMyLocationButton
          showsCompass
          showsScale
          loadingEnabled
          mapType={mapType}
          ref={this.setMapRef}
          rotateEnabled={false}
          pitchEnabled={false}
          toolbarEnabled={false}
          style={mapStyle}
          provider="google"
          initialRegion={this._initialRegion}
          onPress={this.onDeselect}
          onMarkerDeselect={this.onDeselect}
          onRegionChange={this.onRegionChange}
          onRegionChangeComplete={this.onRegionChange}
          onLayout={this.onMapLayout}
          onUserLocationChange={this.onUserLocationChange}
          onMapReady={this.onMapReady}
        >
          {this.props.children}
        </RNMapView>
        <LayersIcon />
      </View>
    );
  }
}

const MapWithFocus: React.ComponentType<
  MapComponentProps & ConnectProps & OwnProps
> = withNavigationFocus(MapView as any) as any;

const MapViewWithLayer: React.ComponentType<
  MapComponentProps & OwnProps
> = connect((state: RootState) => ({
  mapType: state.settings.mapType,
}))(MapWithFocus);

export const Map = MapBody(
  MapViewWithLayer,
  SimpleSection,
  SimplePOI,
  ({ renderArrowhead }) => ({ renderArrowhead }),
  () => ({}),
);
