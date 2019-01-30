import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BlackPortal } from 'react-native-portal';
import { MapLayoutProps } from '@whitewater-guide/clients';

export const getMapLayout = (portalName: string) => {
  class MapLayout extends React.PureComponent<MapLayoutProps> {
    render() {
      const { mapView, selectedSectionView, selectedPOIView } = this.props;
      return (
        <View style={StyleSheet.absoluteFill}>
          {mapView}
          <BlackPortal name={portalName}>
            <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
              {selectedSectionView}
              {selectedPOIView}
            </View>
          </BlackPortal>
        </View>
      );
    }
  }

  return MapLayout;
};
