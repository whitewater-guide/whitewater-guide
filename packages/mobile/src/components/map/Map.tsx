import React from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import RNMapView, { Region as MapsRegion } from 'react-native-maps';
import { MapBody, MapComponentProps, MapProps } from '../../ww-clients/features/maps';
import { getBBox, getBoundsZoomLevel } from '../../ww-clients/utils';
import { Coordinate } from '../../ww-commons/features/points';
import { SimplePOI } from './SimplePOI';
import { SimpleSection } from './SimpleSection';

export class MapView extends React.PureComponent<MapComponentProps> {
  _initialRegion: MapsRegion;
  _bounds: Coordinate[];
  _dimensions: { width: number, height: number };

  constructor(props: MapComponentProps) {
    super(props);
    const [minLng, maxLng, minLat, maxLat] = getBBox(
      props.initialBounds || props.contentBounds || [[-180, -90], [180, 90]],
    );
    this._initialRegion = {
      latitude: (maxLat + minLat) / 2,
      longitude: (maxLng + minLng) / 2,
      latitudeDelta: (maxLat - minLat) / 2,
      longitudeDelta: (maxLng - minLng) / 2,
    };
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
      [region.longitude - region.longitudeDelta, region.latitude - region.latitudeDelta],
      [region.longitude + region.longitudeDelta, region.latitude + region.latitudeDelta],
    ];
    const zoomLevel = getBoundsZoomLevel(this._bounds, this._dimensions);
    this.props.onZoom(zoomLevel);
    // this.props.onBoundsSelected(this._bounds);
  };

  onMapLayout = ({ nativeEvent: { layout: { width, height } } }: LayoutChangeEvent) => {
    // if (this._mapLaidOut || !this._mapView) {
    //   return;
    // }
    // this._mapLaidOut = true;
    this._dimensions = { width, height };
    // const { initialBounds, contentBounds } = this.props;
    // if (initialBounds) {
    //   if (!this._requestedGeolocation) {
    //     this._requestedGeolocation = true;
    //     navigator.geolocation.getCurrentPosition(
    //       this.onGeolocationSuccess,
    //       () => {},
    //       { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 },
    //     );
    //   }
    // } else if (contentBounds) {
    //   // Without this timeout, fitToCoordinates sometimes does nothing
    //   // Maybe this PR can solve things: https://github.com/airbnb/react-native-maps/pull/1369
    //   setTimeout(() => {
    //     const ir = this._initialRegion;
    //     this._mapView.fitToCoordinates(
    //       [
    //         { latitude: ir.latitude - ir.latitudeDelta, longitude: ir.longitude - ir.longitudeDelta },
    //         { latitude: ir.latitude + ir.latitudeDelta, longitude: ir.longitude + ir.longitudeDelta },
    //       ],
    //       {
    //         edgePadding: { left: 16, right: 16, top: 16, bottom: 16 },
    //         animated: false,
    //       },
    //     );
    //   }, 200);
    // }
  };

  render() {
    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <RNMapView
          showsUserLocation
          showsMyLocationButton
          showsCompass
          showsScale
          rotateEnabled={false}
          pitchEnabled={false}
          toolbarEnabled={false}
          initialRegion={this._initialRegion}
          style={StyleSheet.absoluteFill}
          provider="google"
          onPress={this.onDeselect}
          onMarkerDeselect={this.onDeselect}
          onRegionChange={this.onRegionChange}
          onRegionChangeComplete={this.onRegionChange}
          onLayout={this.onMapLayout}
        >
          {this.props.children}
        </RNMapView>
      </View>
    );
  }
}

export const Map: React.ComponentType<MapProps> = MapBody(MapView, SimpleSection, SimplePOI);
