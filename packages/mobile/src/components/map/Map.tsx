import React from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import RNMapView, { Region as MapsRegion } from 'react-native-maps';
import { MapBody, MapComponentProps, MapProps } from '../../ww-clients/features/maps';
import { computeDistanceBetween, computeOffset, getBBox, getBoundsZoomLevel } from '../../ww-clients/utils';
import { Coordinate } from '../../ww-commons/features/points';
import { SimplePOI } from './SimplePOI';
import { SimpleSection } from './SimpleSection';

export class MapView extends React.PureComponent<MapComponentProps> {
  _map: RNMapView | null;
  _mapLaidOut: boolean = false;
  _userLocationSet: boolean = false;
  _bounds: Coordinate[];
  _dimensions: { width: number, height: number };

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
    this._dimensions = { width, height };
    if (this._map && !this._mapLaidOut) {
      this._mapLaidOut = true;
      this._map.fitToCoordinates(
        this.props.initialBounds!.map(([ longitude, latitude]) => ({ longitude, latitude })),
        {
          edgePadding: { top: 20, left: 20, right: 20, bottom: 20 },
          animated: false,
        },
      );
    }
  };

  onUserLocationChange = (evt: any) => {
    if (this._userLocationSet) {
      return;
    }
    this._userLocationSet = true;
    const { latitude, longitude } = evt.nativeEvent.coordinate;
    const [minLng, maxLng, minLat, maxLat] = getBBox(this.props.initialBounds);
    if (this._map && latitude >= minLat && latitude <= maxLat && longitude >= minLng && longitude <= maxLng) {
      if (computeDistanceBetween([minLng, minLat], [maxLng, maxLat]) < 150) {
        this._map.animateToCoordinate({ latitude, longitude }, 300);
      } else {
        const corner = computeOffset({ latitude, longitude }, 100, -45);
        this._map.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: Math.abs(latitude - corner.latitude),
            longitudeDelta: Math.abs(longitude - corner.longitude),
          },
          300,
        );
      }
    }
  };

  setMapRef = (ref: RNMapView) => {
    this._map = ref;
  };

  render() {
    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <RNMapView
          showsUserLocation
          showsMyLocationButton
          showsCompass
          showsScale
          ref={this.setMapRef}
          rotateEnabled={false}
          pitchEnabled={false}
          toolbarEnabled={false}
          style={StyleSheet.absoluteFill}
          provider="google"
          onPress={this.onDeselect}
          onMarkerDeselect={this.onDeselect}
          onRegionChange={this.onRegionChange}
          onRegionChangeComplete={this.onRegionChange}
          onLayout={this.onMapLayout}
          onUserLocationChange={this.onUserLocationChange}
        >
          {this.props.children}
        </RNMapView>
      </View>
    );
  }
}

export const Map: React.ComponentType<MapProps> = MapBody(MapView, SimpleSection, SimplePOI);
