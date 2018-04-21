import React from 'react';
import { StyleSheet, View } from 'react-native';
import RNMapView from 'react-native-maps';
import { MapBody, MapComponentProps, MapProps } from '../../ww-clients/features/maps';
import { getBBox } from '../../ww-clients/utils';
import { SimplePOI } from './SimplePOI';
import { SimpleSection } from './SimpleSection';

export class MapView extends React.PureComponent<MapComponentProps> {
  _initialRegion: any;

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
        >
          {this.props.children}
        </RNMapView>
      </View>
    );
  }
}

export const Map: React.ComponentType<MapProps> = MapBody(MapView, SimpleSection, SimplePOI);
